import http from "node:http";
import { chromium } from "@playwright/test";

const PORT = Number(process.env.VALIDATOR_PORT || 4173);
/** 검증 대상 페이지. 로컬 정적 서버(예: npx serve .) 주소로 맞추세요. */
const BASE_URL = String(process.env.VALIDATOR_TARGET_URL || "http://127.0.0.1:3000/").replace(/\/?$/, "/");

/** CORS + Chrome Private Network Access (file:// → localhost fetch 등) */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Private-Network": "true",
  "Access-Control-Max-Age": "86400"
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...CORS_HEADERS
  });
  res.end(JSON.stringify(body));
}

function sendOptions(res) {
  res.writeHead(204, CORS_HEADERS);
  res.end();
}

async function clickByNames(page, names) {
  for (const name of names) {
    const btn = page.getByRole("button", { name: new RegExp(name, "i") }).first();
    if ((await btn.count()) > 0) {
      await btn.click();
      return true;
    }
    const link = page.getByRole("link", { name: new RegExp(name, "i") }).first();
    if ((await link.count()) > 0) {
      await link.click();
      return true;
    }
    const text = page.getByText(new RegExp(name, "i")).first();
    if ((await text.count()) > 0) {
      await text.click();
      return true;
    }
  }
  return false;
}

async function fillByLabels(page, pairs) {
  for (const [label, value] of pairs) {
    const input = page.getByLabel(new RegExp(label, "i")).first();
    if ((await input.count()) > 0) {
      await input.fill(value);
      continue;
    }
    const byPlaceholder = page.getByPlaceholder(new RegExp(label, "i")).first();
    if ((await byPlaceholder.count()) > 0) {
      await byPlaceholder.fill(value);
    }
  }
}

async function runChecks(checkIds) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const logs = [];
  const checks = {};
  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    logs.push("랜딩 페이지 로드");

    if (checkIds.includes("visited_contact") || checkIds.includes("submitted_contact_form")) {
      const moved = await clickByNames(page, ["문의", "문의하기", "contact"]);
      let onContact = moved;
      if (moved) {
        try {
          await page.getByRole("heading", { name: /문의/i }).first().waitFor({ state: "visible", timeout: 8000 });
          onContact = true;
        } catch {
          onContact = (await page.getByText(/문의 보내기|문의하기/i).count()) > 0;
        }
      }
      checks.visited_contact = onContact;
      logs.push(`문의하기 이동: ${onContact ? "성공" : "실패"}`);
      if (onContact && checkIds.includes("submitted_contact_form")) {
        await fillByLabels(page, [
          ["제목|title", "자동 검증 제목"],
          ["내용|message|body", "자동 검증 내용"]
        ]);
        const submitted = await clickByNames(page, ["문의 보내기", "제출", "submit"]);
        checks.submitted_contact_form = submitted;
        logs.push(`문의 제출 시도: ${submitted ? "성공" : "실패"}`);
      }
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    }

    if (checkIds.includes("visited_apply") || checkIds.includes("submitted_apply_form")) {
      const moved = await clickByNames(page, ["신청", "지금 신청하기", "apply"]);
      checks.visited_apply = moved;
      logs.push(`신청 화면 이동: ${moved ? "성공" : "실패"}`);
      if (moved && checkIds.includes("submitted_apply_form")) {
        await fillByLabels(page, [
          ["이름|name", "자동검증"],
          ["이메일|email", "auto@qa.test"],
          ["요청|note|message", "자동 검증 신청 내용"]
        ]);
        const submitted = await clickByNames(page, ["신청 보내기", "제출", "submit"]);
        checks.submitted_apply_form = submitted;
        logs.push(`신청 제출 시도: ${submitted ? "성공" : "실패"}`);
      }
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    }

    if (checkIds.includes("visited_plans")) {
      const moved = await clickByNames(page, ["플랜", "구매 플랜", "plans"]);
      checks.visited_plans = moved;
      logs.push(`플랜 화면 이동: ${moved ? "성공" : "실패"}`);
    }

    if (checkIds.includes("visited_signup")) {
      checks.visited_signup = await clickByNames(page, ["회원가입", "가입", "sign up"]);
      logs.push(`회원가입 이동: ${checks.visited_signup ? "성공" : "실패"}`);
    }

    if (checkIds.includes("visited_login")) {
      checks.visited_login = await clickByNames(page, ["로그인", "login"]);
      logs.push(`로그인 이동: ${checks.visited_login ? "성공" : "실패"}`);
    }

    checkIds.forEach((id) => {
      if (typeof checks[id] !== "boolean") checks[id] = false;
    });
    return { checks, logs };
  } finally {
    await context.close();
    await browser.close();
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendOptions(res);
  }
  if (req.method !== "POST" || req.url !== "/validate") {
    return sendJson(res, 404, { ok: false, message: "not found" });
  }
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
  });
  req.on("end", async () => {
    try {
      const body = JSON.parse(raw || "{}");
      const checkIds = Array.isArray(body.checkIds) ? body.checkIds : [];
      const result = await runChecks(checkIds);
      sendJson(res, 200, { ok: true, ...result });
    } catch (err) {
      sendJson(res, 500, { ok: false, message: err.message || String(err), checks: {}, logs: [] });
    }
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    // eslint-disable-next-line no-console
    console.error(
      `Port ${PORT} is already in use. Stop the other validator, or set env VALIDATOR_PORT (e.g. 4174) and run npm run validator:start again.`
    );
  } else {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`Validator server listening on http://127.0.0.1:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Also try: http://localhost:${PORT} (some browsers prefer localhost with file://)`);
});

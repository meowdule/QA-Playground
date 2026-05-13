import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { input: "./data/scenarios.json", out: "./e2e/generated" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = argv[i + 1];
    if (argv[i] === "--out") args.out = argv[i + 1];
  }
  return args;
}

function sanitizeFileName(name) {
  return String(name || "scenario")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function asArrayPayload(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.scenarios)) return raw.scenarios;
  if (raw?.scenario) return [raw.scenario];
  return [];
}

function targetText(target) {
  const t = String(target || "").trim();
  return t;
}

function locatorCandidates(target) {
  const t = targetText(target);
  if (!t) return ["page.locator('body')"];
  const escaped = t.replace(/'/g, "\\'");
  const candidates = [];

  // 1) semantic-key tuned
  if (/company_name|회사명|company/i.test(t)) candidates.push("page.getByLabel(/company|회사명/i)");
  if (/manager|owner|담당자|person/i.test(t)) candidates.push("page.getByLabel(/manager|owner|담당자|이름/i)");
  if (/company_number|biz|사업자|number/i.test(t)) candidates.push("page.getByLabel(/사업자|company number|번호/i)");
  if (/email|mail/i.test(t)) candidates.push("page.getByLabel(/email|이메일/i)");
  if (/phone|tel|mobile|번호/i.test(t)) candidates.push("page.getByLabel(/phone|연락처|번호/i)");
  if (/address|addr|주소/i.test(t)) candidates.push("page.getByLabel(/address|주소/i)");
  if (/name|담당자|회사명/i.test(t)) candidates.push("page.getByLabel(/name|이름|회사명|담당자/i)");
  if (/submit|등록|저장|완료|신청/i.test(t)) candidates.push("page.getByRole('button', { name: /submit|등록|저장|완료|신청/i })");
  if (/login|로그인/i.test(t)) candidates.push("page.getByRole('button', { name: /login|로그인/i })");
  if (/signup|회원가입/i.test(t)) candidates.push("page.getByRole('button', { name: /회원가입|가입|sign up/i })");
  if (/error|invalid|실패|오류/i.test(t)) candidates.push("page.getByText(/오류|실패|invalid|required|필수/i).first()");
  if (/toast|success|성공|완료/i.test(t)) candidates.push("page.getByText(/성공|완료|저장|registered|submitted/i).first()");

  // 2) generic fallback chain
  candidates.push(`page.getByRole('button', { name: /${escaped}/i }).first()`);
  candidates.push(`page.getByRole('link', { name: /${escaped}/i }).first()`);
  candidates.push(`page.getByLabel(/${escaped}/i).first()`);
  candidates.push(`page.getByPlaceholder(/${escaped}/i).first()`);
  candidates.push(`page.getByText('${escaped}').first()`);
  candidates.push(`page.locator("[name='${escaped}'], [id='${escaped}'], [data-testid='${escaped}']").first()`);

  // unique
  return [...new Set(candidates)];
}

function locatorRef(target) {
  const c = locatorCandidates(target).map((x) => `'${x.replace(/'/g, "\\'")}'`).join(", ");
  return `await firstVisibleLocator(page, [${c}], '${String(target || "").replace(/'/g, "\\'")}')`;
}

function stepToCode(step) {
  const locator = locatorRef(step.target);
  if (step.action === "fill") {
    const value = String(step.value ?? "sample-value").replace(/'/g, "\\'");
    return `{
    const locator = ${locator};
    await locator.fill('${value}');
  }`;
  }
  if (step.action === "clear")
    return `{
    const locator = ${locator};
    await locator.clear();
  }`;
  if (step.action === "click" || step.action === "interact")
    return `{
    const locator = ${locator};
    await locator.click();
  }`;
  return `// TODO: unsupported action "${step.action}" for target "${step.target}"`;
}

function helperBlock() {
  return `
async function firstVisibleLocator(page, expressions, targetName) {
  for (const expr of expressions) {
    try {
      const locator = new Function('page', 'return ' + expr)(page);
      const count = await locator.count();
      if (count > 0) {
        const first = locator.first();
        await first.waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        return first;
      }
    } catch {
      // ignore and continue fallback chain
    }
  }
  throw new Error(\`No locator matched target: \${targetName}\`);
}
`.trim();
}

function createNormalSpec(scenario) {
  const title = scenario.name || "generated scenario";
  const steps = scenario?.missionDraft?.normalFlow?.steps || scenario.normalSteps || [];
  const sourceUrl = scenario.targetUrl || "http://127.0.0.1:4173";
  const stepLines = steps.length ? steps.map(stepToCode).join("\n  ") : "// TODO: add normal-flow steps";
  const successLocator = detectSuccessLocator(scenario);
  const assertLine = successLocator
    ? `{
  const locator = ${successLocator};
  await expect(locator).toBeVisible();
}`
    : "await expect(page.locator('body')).toBeVisible();";

  return `import { test, expect } from '@playwright/test';

${helperBlock()}

test('${title} - normal flow', async ({ page }) => {
  await page.goto('${sourceUrl}');
  ${stepLines}
  ${assertLine}
});
`;
}

function detectErrorLocator(scenario) {
  const boxes = Array.isArray(scenario.boxes) ? scenario.boxes : [];
  const byType = boxes.find((b) => b.type === "error");
  if (byType) return locatorRef(byType.semanticKey || "error");
  const bySemantic = boxes.find((b) => /error|invalid|오류|실패/i.test(String(b.semanticKey || "")));
  if (bySemantic) return locatorRef(bySemantic.semanticKey);
  return locatorRef("error");
}

function detectSuccessLocator(scenario) {
  const boxes = Array.isArray(scenario.boxes) ? scenario.boxes : [];
  const byType = boxes.find((b) => b.type === "toast" || b.type === "text");
  if (byType && /success|성공|완료|저장|registered|submitted/i.test(String(byType.semanticKey || ""))) {
    return locatorRef(byType.semanticKey);
  }
  const bySemantic = boxes.find((b) => /success|성공|완료|저장|submitted/i.test(String(b.semanticKey || "")));
  if (bySemantic) return locatorRef(bySemantic.semanticKey);
  return null;
}

function variantAssertionLine(variant, scenario) {
  const kind = String(variant?.kind || "").toLowerCase();
  const customText = String(variant?.expectedText || "").trim();
  if (customText) {
    const esc = customText.replace(/'/g, "\\'");
    return `await expect(page.getByText('${esc}').first()).toBeVisible();`;
  }
  if (kind === "missing_required" || kind === "invalid_format" || kind === "boundary") {
    return `{
  const locator = ${detectErrorLocator(scenario)};
  await expect(locator).toBeVisible();
}`;
  }
  const successLocator = detectSuccessLocator(scenario);
  return successLocator
    ? `{
  const locator = ${successLocator};
  await expect(locator).toBeVisible();
}`
    : "await expect(page.locator('body')).toBeVisible();";
}

function createVariantSpec(scenario) {
  const title = scenario.name || "generated scenario";
  const sourceUrl = scenario.targetUrl || "http://127.0.0.1:4173";
  const variants = (scenario.variants || []).filter((v) => v.enabled !== false);
  const cases =
    variants.length === 0
      ? "test('no active variants', async () => { test.skip(); });"
      : variants
          .map((variant) => {
            const lines = (variant.steps || []).map(stepToCode).join("\n  ");
            const testName = String(variant.name || variant.kind || "variant").replace(/'/g, "\\'");
            const assertion = variantAssertionLine(variant, scenario);
            return `test('${testName}', async ({ page }) => {
  await page.goto('${sourceUrl}');
  ${lines || "// TODO: add variant steps"}
  ${assertion}
});`;
          })
          .join("\n\n");

  return `import { test, expect } from '@playwright/test';

${helperBlock()}

test.describe('${title} - variants', () => {
${cases}
});
`;
}

function ensureDirectory(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeSummaryReports(outDir, scenarios, generatedFiles) {
  const report = {
    generatedAt: new Date().toISOString(),
    scenarioCount: scenarios.length,
    fileCount: generatedFiles.length,
    files: generatedFiles
  };
  fs.writeFileSync(path.join(outDir, "_generation-report.json"), JSON.stringify(report, null, 2), "utf8");

  const mdLines = [
    "# Playwright Generation Report",
    "",
    `- Generated at: ${report.generatedAt}`,
    `- Scenarios: ${report.scenarioCount}`,
    `- Files: ${report.fileCount}`,
    "",
    "## Files",
    ...generatedFiles.map((f) => `- \`${f}\``),
    ""
  ];
  fs.writeFileSync(path.join(outDir, "_generation-report.md"), mdLines.join("\n"), "utf8");
}

function main() {
  const { input, out } = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), input);
  const outDir = path.resolve(process.cwd(), out);
  ensureDirectory(outDir);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const scenarios = asArrayPayload(raw);
  if (scenarios.length === 0) {
    writeSummaryReports(outDir, [], []);
    // eslint-disable-next-line no-console
    console.log(`No scenarios found in ${inputPath}; wrote empty reports.`);
    return;
  }

  const generatedFiles = [];
  scenarios.forEach((scenario, index) => {
    const base = sanitizeFileName(`${index + 1}-${scenario.name || scenario.id || "scenario"}`);
    const normalPath = path.join(outDir, `${base}.normal.spec.js`);
    const variantPath = path.join(outDir, `${base}.variants.spec.js`);
    fs.writeFileSync(normalPath, createNormalSpec(scenario), "utf8");
    fs.writeFileSync(variantPath, createVariantSpec(scenario), "utf8");
    generatedFiles.push(path.relative(process.cwd(), normalPath), path.relative(process.cwd(), variantPath));
  });
  writeSummaryReports(outDir, scenarios, generatedFiles);

  // eslint-disable-next-line no-console
  console.log(`Generated ${generatedFiles.length} Playwright specs in ${outDir}`);
}

main();

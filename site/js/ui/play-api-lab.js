/**
 * 플레이 화면: Postman / Swagger UI 에 가깝게 꾼 연습 데모 (로컬 모의 응답).
 */
(function (global) {
  const QA = (global.QA = global.QA || {});

  const state = {
    postmanListSent: false,
    postmanFilteredSent: false,
    postmanDetailSent: false,
    postmanInquiriesSent: false,
    swaggerListTry: false,
    swaggerFilteredTry: false,
    swaggerDetailTry: false,
    swaggerInquiriesTry: false
  };

  function resetApiLabState() {
    state.postmanListSent = false;
    state.postmanFilteredSent = false;
    state.postmanDetailSent = false;
    state.postmanInquiriesSent = false;
    state.swaggerListTry = false;
    state.swaggerFilteredTry = false;
    state.swaggerDetailTry = false;
    state.swaggerInquiriesTry = false;
  }

  function getApiLabSnapshot() {
    return {
      apiLab: {
        postmanListSent: state.postmanListSent,
        postmanFilteredSent: state.postmanFilteredSent,
        postmanDetailSent: state.postmanDetailSent,
        postmanInquiriesSent: state.postmanInquiriesSent,
        swaggerListTry: state.swaggerListTry,
        swaggerFilteredTry: state.swaggerFilteredTry,
        swaggerDetailTry: state.swaggerDetailTry,
        swaggerInquiriesTry: state.swaggerInquiriesTry
      }
    };
  }

  function catalogSummaryList() {
    const missions = Array.isArray(QA.missions) ? QA.missions : [];
    return missions.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      difficulty: m.difficulty,
      points: m.points,
      chapter: m.chapter,
      levelCode: m.levelCode
    }));
  }

  function catalogDetail(id) {
    const m = typeof QA.getMissionById === "function" ? QA.getMissionById(id) : null;
    if (!m) return null;
    return {
      id: m.id,
      title: m.title,
      summary: m.summary,
      type: m.type,
      difficulty: m.difficulty,
      points: m.points,
      chapter: m.chapter,
      levelCode: m.levelCode,
      objectivesCount: Array.isArray(m.objectives) ? m.objectives.length : 0
    };
  }

  function mockInquiries() {
    return {
      inquiries: [
        {
          id: "inq_demo_1",
          subject: "도입 문의",
          status: "open",
          channel: "web",
          createdAt: "2026-05-01T09:00:00.000Z"
        },
        {
          id: "inq_demo_2",
          subject: "요금 플랜 상담",
          status: "pending",
          channel: "web",
          createdAt: "2026-05-02T11:30:00.000Z"
        }
      ],
      _mock: true
    };
  }

  function resolvePathFromUrlInput(raw) {
    const u = String(raw || "").trim();
    if (!u) return "";
    try {
      if (/^https?:\/\//i.test(u)) {
        const parsed = new URL(u);
        return parsed.pathname + parsed.search;
      }
    } catch {
      return "";
    }
    return u.startsWith("/") ? u : `/${u}`;
  }

  function isMissionsListPath(path) {
    return /^\/api\/v1\/missions\/?(\?.*)?$/i.test(path);
  }

  function isInquiriesListPath(path) {
    return /^\/api\/v1\/inquiries\/?(\?.*)?$/i.test(path);
  }

  function mountPostmanPanel(container, onActivity) {
    container.textContent = "";
    const act = typeof onActivity === "function" ? onActivity : () => {};

    const origin =
      global.location && global.location.origin && global.location.origin !== "null"
        ? global.location.origin.replace(/\/$/, "")
        : "";

    const root = document.createElement("div");
    root.className = "pm-demo";

    root.innerHTML = `
      <aside class="pm-demo-sidebar" aria-label="컬렉션">
        <div class="pm-demo-logo">P</div>
        <div class="pm-demo-side-title">Collections</div>
        <div class="pm-demo-tree">
          <div class="pm-demo-tree-folder is-open">테스피어-Tespier</div>
          <div class="pm-demo-tree-item is-active">Catalog · list</div>
          <div class="pm-demo-tree-item">Catalog · filter</div>
          <div class="pm-demo-tree-item">Catalog · get by id</div>
          <div class="pm-demo-tree-item">Inquiries · list</div>
        </div>
      </aside>
      <div class="pm-demo-main">
        <div class="pm-demo-tabbar">
          <span class="pm-demo-tab is-active">GET missions</span>
          <span class="pm-demo-tab">GET missions ?chapter</span>
          <span class="pm-demo-tab">GET mission</span>
          <span class="pm-demo-tab">GET inquiries</span>
        </div>
        <div class="pm-demo-request">
          <div class="pm-demo-url-row">
            <select class="pm-demo-method" aria-label="HTTP 메서드"></select>
            <input type="text" class="pm-demo-url-input" spellcheck="false" autocomplete="off" aria-label="요청 URL" />
            <button type="button" class="pm-demo-send">Send</button>
          </div>
          <div class="pm-demo-subtabs">
            <span class="is-active">Params</span><span>Authorization</span><span>Headers</span><span>Body</span>
          </div>
          <div class="pm-demo-params-hint muted small">Query Params · URL에 <code>?chapter=</code> 등을 붙여 필터를 연습합니다.</div>
        </div>
        <div class="pm-demo-response">
          <div class="pm-demo-res-head">
            <span class="pm-demo-res-title">Response</span>
            <span class="pm-demo-status"></span>
            <span class="pm-demo-meta muted small"></span>
          </div>
          <div class="pm-demo-subtabs pm-demo-res-tabs"><span class="is-active">Body</span><span>Cookies</span><span>Headers (0)</span></div>
          <pre class="pm-demo-body" aria-live="polite"></pre>
        </div>
      </div>
    `;

    const methodSel = root.querySelector(".pm-demo-method");
    ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach((m) => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      methodSel.appendChild(o);
    });
    methodSel.value = "GET";

    const urlInp = root.querySelector(".pm-demo-url-input");
    urlInp.placeholder = "{{baseUrl}}/api/v1/missions";
    urlInp.value = origin ? `${origin}/api/v1/missions` : "/api/v1/missions";

    const sendBtn = root.querySelector(".pm-demo-send");
    const statusEl = root.querySelector(".pm-demo-status");
    const metaEl = root.querySelector(".pm-demo-meta");
    const bodyOut = root.querySelector(".pm-demo-body");
    const treeItems = root.querySelectorAll(".pm-demo-tree-item");
    const tabs = root.querySelectorAll(".pm-demo-tab");

    function setResponse(statusText, jsonObj, ms) {
      statusEl.textContent = statusText;
      metaEl.textContent = ms != null ? `${ms} ms · 모의 응답` : "";
      bodyOut.textContent = JSON.stringify(jsonObj, null, 2);
    }

    function runSend() {
      const t0 = performance.now();
      const method = methodSel.value;
      const path = resolvePathFromUrlInput(urlInp.value);
      act(`요청: ${method} ${path || urlInp.value}`);

      const detailMatch = path.match(/^\/api\/v1\/missions\/([^/?#]+)\/?(\?.*)?$/i);

      if (method === "GET" && isInquiriesListPath(path)) {
        state.postmanInquiriesSent = true;
        const ms = Math.round(performance.now() - t0);
        setResponse("200 OK", mockInquiries(), ms);
        act("문의 목록 응답 수신 (모의).");
        return;
      }

      if (method === "GET" && isMissionsListPath(path)) {
        const ms = Math.round(performance.now() - t0);
        const q = path.includes("?") ? path.slice(path.indexOf("?")) : "";
        const params = new URLSearchParams(q.startsWith("?") ? q.slice(1) : q);
        const ch = params.get("chapter");
        if (ch) {
          state.postmanFilteredSent = true;
          const filtered = catalogSummaryList().filter((m) => m.chapter === ch);
          setResponse("200 OK", { missions: filtered, _filter: { chapter: ch } }, ms);
          act(`목록 필터 응답 (chapter=${ch}).`);
        } else {
          state.postmanListSent = true;
          setResponse("200 OK", { missions: catalogSummaryList() }, ms);
          act("목록 응답 수신 (모의).");
        }
        return;
      }

      if (method === "GET" && detailMatch) {
        const id = decodeURIComponent(detailMatch[1]);
        const d = catalogDetail(id);
        const ms = Math.round(performance.now() - t0);
        if (d) {
          state.postmanDetailSent = true;
          setResponse("200 OK", { mission: d }, ms);
          act(`단건 응답 (${id})`);
        } else {
          setResponse("404 Not Found", { error: "unknown_mission", missionId: id }, ms);
        }
        return;
      }

      const ms = Math.round(performance.now() - t0);
      setResponse(
        "501 Not Implemented",
        {
          detail:
            "연습 데모: GET /api/v1/missions, GET /api/v1/missions/{id}, GET /api/v1/inquiries 만 모의합니다."
        },
        ms
      );
    }

    sendBtn.addEventListener("click", runSend);

    function selectTree(i) {
      treeItems.forEach((el, idx) => el.classList.toggle("is-active", idx === i));
      tabs.forEach((el, idx) => el.classList.toggle("is-active", idx === i));
      methodSel.value = "GET";
      const base = origin || "";
      if (i === 0) {
        urlInp.value = base ? `${base}/api/v1/missions` : "/api/v1/missions";
      } else if (i === 1) {
        const q = "chapter=screen_test";
        urlInp.value = base ? `${base}/api/v1/missions?${q}` : `/api/v1/missions?${q}`;
      } else if (i === 2) {
        urlInp.value = base ? `${base}/api/v1/missions/m_inquiry` : "/api/v1/missions/m_inquiry";
      } else {
        urlInp.value = base ? `${base}/api/v1/inquiries` : "/api/v1/inquiries";
      }
    }

    treeItems.forEach((el, i) => {
      el.addEventListener("click", () => {
        selectTree(i);
        runSend();
      });
    });

    tabs.forEach((el, i) => {
      el.addEventListener("click", () => {
        selectTree(i);
        runSend();
      });
    });

    container.appendChild(root);
  }

  function mountSwaggerPanel(container, onActivity) {
    container.textContent = "";
    const act = typeof onActivity === "function" ? onActivity : () => {};

    const wrap = document.createElement("div");
    wrap.className = "swg-demo";
    wrap.innerHTML = `
      <header class="swg-demo-topbar">
        <span class="swg-demo-title">Studio API</span>
        <span class="swg-demo-ver muted small">OAS 3.0 · 연습 UI</span>
        <span class="swg-demo-auth">Authorize</span>
      </header>
      <div class="swg-demo-filterbar">
        <input type="search" class="swg-demo-filter" placeholder="Filter by tag …" disabled />
      </div>
      <div class="swg-demo-tag">Catalog · Inquiries</div>
      <p class="swg-demo-desc muted small">미션 카탈로그·문의 목록 읽기 (모의). 외부 서버 없음.</p>
      <div class="swg-demo-ops" id="swgOpsMount"></div>
    `;

    const opsMount = wrap.querySelector("#swgOpsMount");

    function opBlock(method, path, summary, onMark, execFn) {
      const block = document.createElement("div");
      block.className = "swg-op";
      block.innerHTML = `
        <button type="button" class="swg-op-chevron" aria-expanded="false" aria-label="펼치기">▸</button>
        <span class="swg-op-method swg-op-method--${method.toLowerCase()}">${method}</span>
        <code class="swg-op-path">${path}</code>
        <span class="swg-op-sum muted">${summary}</span>
        <div class="swg-op-panel" hidden>
          <p class="swg-op-ai muted small">Parameters · Execute 시 브라우저가 JSON을 생성합니다.</p>
          <div class="swg-op-actions">
            <button type="button" class="swg-btn-try">Try it out</button>
            <button type="button" class="swg-btn-exec" hidden>Execute</button>
          </div>
          <div class="swg-op-res-wrap" hidden>
            <div class="swg-op-res-label">Responses</div>
            <pre class="swg-op-res"></pre>
          </div>
        </div>
      `;

      const chev = block.querySelector(".swg-op-chevron");
      const panel = block.querySelector(".swg-op-panel");
      const tryBtn = block.querySelector(".swg-btn-try");
      const execBtn = block.querySelector(".swg-btn-exec");
      const resWrap = block.querySelector(".swg-op-res-wrap");
      const pre = block.querySelector(".swg-op-res");

      chev.addEventListener("click", () => {
        const open = panel.hidden;
        panel.hidden = !open;
        chev.setAttribute("aria-expanded", open ? "true" : "false");
        chev.textContent = open ? "▾" : "▸";
      });

      tryBtn.addEventListener("click", () => {
        execBtn.hidden = false;
        tryBtn.textContent = "Cancel";
      });

      execBtn.addEventListener("click", () => {
        onMark();
        pre.textContent = JSON.stringify(execFn(), null, 2);
        resWrap.hidden = false;
        act(`Execute ${method} ${path}`);
      });

      return block;
    }

    opsMount.appendChild(
      opBlock("GET", "/api/v1/missions", "listMissions", () => {
        state.swaggerListTry = true;
      }, () => ({ missions: catalogSummaryList(), _mock: true }))
    );
    opsMount.appendChild(
      opBlock("GET", "/api/v1/missions?chapter=postman_test", "listMissions (filtered)", () => {
        state.swaggerFilteredTry = true;
      }, () => ({
        missions: catalogSummaryList().filter((m) => m.chapter === "postman_test"),
        _mock: true,
        _filter: { chapter: "postman_test" }
      }))
    );
    opsMount.appendChild(
      opBlock("GET", "/api/v1/missions/{missionId}", "getMissionById", () => {
        state.swaggerDetailTry = true;
      }, () => ({ mission: catalogDetail("m_inquiry"), _mock: true }))
    );
    opsMount.appendChild(
      opBlock("GET", "/api/v1/inquiries", "listInquiries", () => {
        state.swaggerInquiriesTry = true;
      }, () => mockInquiries())
    );

    container.appendChild(wrap);
  }

  QA.playApiLab = {
    resetApiLabState,
    getApiLabSnapshot,
    mountPostmanPanel,
    mountSwaggerPanel
  };
})(typeof window !== "undefined" ? window : globalThis);

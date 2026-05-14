/** 토론: `/board` 허브 + `/board/:slug` 개별 페이지 */

const TOPICS = {
  severity: {
    title: "심각도 논의",
    kicker: "판단 근거 토론",
    sampleTitle: "재현이 안 되는데 Block으로 올려도 될까요?",
    sampleBody:
      "사용자 데이터 손실·보안·결제 중단이 없다면 팀 규칙에 따라 Major로 두고, 재현 시도 로그를 남기는 편이 안전합니다."
  },
  "tc-design": {
    title: "TC 설계 기준",
    kicker: "방법론 논의",
    sampleTitle: "Given/When/Then을 한 문장으로 써도 되나요?",
    sampleBody: "짧은 스모크는 한 줄로도 되지만, 검증이 두 개면 케이스를 나누는 게 유지보수에 유리합니다."
  },
  "defect-edge": {
    title: "결함 여부 논의",
    kicker: "경계 케이스",
    sampleTitle: "버튼 색만 다르고 동작은 같으면 결함일까요?",
    sampleBody: "스펙에 색이 명시돼 있으면 UI 결함, 아니면 개선 제안으로 분리하는 팀도 많습니다."
  },
  free: {
    title: "자유 토론",
    kicker: "QA 일반",
    sampleTitle: "첫 출근한 QA에게 추천하는 첫 미션",
    sampleBody: "문의 폼 한 줄이라도 기대·실제를 적어 보는 시나리오부터 추천합니다."
  }
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getBoardHubHtml() {
  const h = window.QA.learnerHref;
  const keys = Object.keys(TOPICS);
  const cards = keys
    .map((slug) => {
      const t = TOPICS[slug];
      return `
      <li>
        <a class="course-card course-card--feature" href="${h.boardTopic(slug)}" style="text-decoration:none;color:inherit;">
          <h3 class="course-title"><span class="course-title-text">${esc(t.title)}</span></h3>
          <p class="course-desc">${esc(t.kicker)}</p>
          <span class="course-more">토론 페이지 →</span>
        </a>
      </li>`;
    })
    .join("");
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">토론</h1>
      <p class="site-hero-desc">주제별 <strong>독립 URL</strong>입니다. 정적 데모이며 글쓰기·DB는 추후 연동할 수 있습니다.</p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow">
      <ul class="board-hub-list" style="list-style:none;margin:0;padding:0;display:grid;gap:12px;">
        ${cards}
      </ul>
    </div>
  </main>`;
}

export function getBoardTopicHtml(slug) {
  const h = window.QA.learnerHref;
  const t = TOPICS[slug];
  if (!t) return null;
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <p class="muted small" style="margin:0 0 6px;"><a class="inline-link" href="${h.board()}">← 토론 목록</a></p>
      <h1 class="site-hero-title">${esc(t.title)}</h1>
      <p class="site-hero-desc">${esc(t.kicker)} · 샘플 스레드</p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow">
      <article class="detail-card">
        <p class="muted small" style="margin:0 0 0.35rem;">샘플</p>
        <strong>${esc(t.sampleTitle)}</strong>
        <p class="detail-body" style="margin-top:0.5rem;">${esc(t.sampleBody)}</p>
        <p class="muted small" style="margin-top:1rem;"><a class="inline-link" href="${h.learn()}">학습</a> · <a class="inline-link" href="${h.home()}">미션</a></p>
      </article>
    </div>
  </main>`;
}

export function initBoardHubPage() {
  const QA = window.QA;
  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    QA.mountAuthNav(slot, { returnPath: QA.learnerHref.board() });
  }
}

export function initBoardTopicPage(slug) {
  const QA = window.QA;
  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    QA.mountAuthNav(slot, { returnPath: QA.learnerHref.boardTopic(slug) });
  }
}

export function getBoardTopicTitleForDoc(slug) {
  const t = TOPICS[slug];
  return t ? `${t.title} · 토론 · 테스피어-Tespier` : "토론 · 테스피어-Tespier";
}

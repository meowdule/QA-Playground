/** 학습: `/learn` 허브 + `/learn/:slug` 개별 페이지 (미션 홈과 분리) */

const ARTICLES = {
  concepts: {
    title: "QA 개념",
    desc: "용어·역할·품질 목표를 맞추는 단계입니다.",
    body: `<p class="detail-body">기대 결과·실제 결과·재현 절차를 구분해 말할 수 있으면 이후 미션에서 같은 말이 통합니다.</p>`
  },
  techniques: {
    title: "테스트 기법",
    desc: "동등분할·경계값 등 입력 공간을 나누는 사고",
    body: `<p class="detail-body">동등분할·경계값·상태 전이 등으로 케이스를 쪼개는 연습입니다. TC 작성 실습과도 연결됩니다.</p>`
  },
  "defect-mgmt": {
    title: "결함 관리",
    desc: "심각도·우선순위·재현 정보",
    body: `<p class="detail-body">심각도·우선순위는 팀 규칙과 사용자 영향도에 따라 달라집니다. <strong>재현 단계·환경</strong>을 빠짐없이 적는 습관을 우선합니다.</p>`
  },
  reports: {
    title: "보고서 작성",
    desc: "PASS/FAIL·근거 정리",
    body: `<p class="detail-body">PASS/FAIL·근거 한 줄·확인한 UI 텍스트 인용 등, 나중에 읽는 사람이 따라올 수 있게 쓰는 연습입니다.</p>`
  },
  "sqat-exam": {
    title: "SQAT 시험",
    desc: "출제 범위 안내",
    body: `<p class="detail-body">이 연습장 챕터(화면·API·Swagger·TC)와 흐름을 맞춰 두었습니다. 실제 시험 정책은 주관 기관 안내를 따르세요.</p>`
  }
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getLearnHubHtml() {
  const h = window.QA.learnerHref;
  const items = [
    ["concepts", "QA 개념", "용어 / 이론"],
    ["techniques", "테스트 기법", "동등분할 등"],
    ["defect-mgmt", "결함 관리", "심각도 기준"],
    ["reports", "보고서 작성", "PASS/FAIL 기준"],
    ["sqat-exam", "SQAT 시험", "출제 범위 안내"]
  ];
  const cards = items
    .map(
      ([slug, t, d]) => `
      <li>
        <a class="course-card course-card--feature" href="${h.learnArticle(slug)}" style="text-decoration:none;color:inherit;">
          <h3 class="course-title"><span class="course-title-text">${esc(t)}</span></h3>
          <p class="course-desc">${esc(d)}</p>
          <span class="course-more">학습 페이지 →</span>
        </a>
      </li>`
    )
    .join("");
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">학습</h1>
      <p class="site-hero-desc">미션·챌린지와 별도의 <strong>학습 전용</strong> 페이지입니다. 항목마다 독립 URL로 들어옵니다.</p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow">
      <ul class="learn-hub-list" style="list-style:none;margin:0;padding:0;display:grid;gap:12px;">
        ${cards}
      </ul>
    </div>
  </main>`;
}

export function getLearnArticleHtml(slug) {
  const h = window.QA.learnerHref;
  const art = ARTICLES[slug];
  if (!art) return null;
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <p class="muted small" style="margin:0 0 6px;"><a class="inline-link" href="${h.learn()}">← 학습 목록</a></p>
      <h1 class="site-hero-title">${esc(art.title)}</h1>
      <p class="site-hero-desc">${esc(art.desc)}</p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow">
      <article class="detail-card">${art.body}
        <p class="muted small" style="margin-top:1rem;">
          <a class="inline-link" href="${h.home()}">미션</a> · <a class="inline-link" href="${h.tcLab()}">TC 작성</a>
          ${slug === "defect-mgmt" ? ` · <a class="inline-link" href="${h.boardTopic("severity")}">토론 · 심각도</a>` : ""}
        </p>
      </article>
    </div>
  </main>`;
}

export function initLearnHubPage() {
  const QA = window.QA;
  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    QA.mountAuthNav(slot, { returnPath: QA.learnerHref.learn() });
  }
}

export function initLearnArticlePage(slug) {
  const QA = window.QA;
  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    QA.mountAuthNav(slot, { returnPath: QA.learnerHref.learnArticle(slug) });
  }
}

export function getLearnArticleTitleForDoc(slug) {
  const a = ARTICLES[slug];
  return a ? `${a.title} · 학습 · QA Playground` : "학습 · QA Playground";
}

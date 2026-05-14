/** 학습 허브: 메가 메뉴·직접 URL의 ?section= 과 연동 */
const SECTION_IDS = {
  "qa-concepts": "learn-qa-concepts",
  "test-techniques": "learn-test-techniques",
  "defect-mgmt": "learn-defect-mgmt",
  "report-writing": "learn-report-writing",
  "sqat-exam": "learn-sqat-exam"
};

export function getLearnPageHtml() {
  const h = window.QA.learnerHref;
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">학습</h1>
      <p class="site-hero-desc">
        QA·테스트·결함·보고·시험 범위를 한 페이지에서 훑을 수 있습니다. 상단 <strong>메가 메뉴</strong>의 항목과 같은 앵커로 연결됩니다.
      </p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow learn-hub">
      <article id="learn-qa-concepts" class="learn-section detail-card">
        <h2 class="detail-h2">QA 개념</h2>
        <p class="detail-body">용어·역할·품질 목표를 맞추는 단계입니다. 기대 결과·실제 결과·재현 절차를 구분해 말할 수 있으면 이후 미션에서 같은 말이 통합니다.</p>
        <p class="muted small"><a class="inline-link" href="${h.home()}">미션(시나리오)으로 연습 →</a></p>
      </article>
      <article id="learn-test-techniques" class="learn-section detail-card">
        <h2 class="detail-h2">테스트 기법</h2>
        <p class="detail-body">동등분할·경계값·상태 전이 등으로 입력 공간을 나누는 사고를 합니다. TC 작성 메뉴의 과정에서도 같은 관점으로 케이스를 쪼개 보세요.</p>
        <p class="muted small"><a class="inline-link" href="${h.tcLab()}">TC 작성 실습 →</a></p>
      </article>
      <article id="learn-defect-mgmt" class="learn-section detail-card">
        <h2 class="detail-h2">결함 관리</h2>
        <p class="detail-body">심각도·우선순위는 팀 규칙과 사용자 영향도에 따라 달라집니다. 데모에서는 <strong>재현 단계·환경·첨부</strong>를 빠짐없이 적는 연습을 우선합니다.</p>
        <p class="muted small"><a class="inline-link" href="${h.boardQuery("severity")}">토론(심각도) 샘플 →</a></p>
      </article>
      <article id="learn-report-writing" class="learn-section detail-card">
        <h2 class="detail-h2">보고서 작성</h2>
        <p class="detail-body">PASS/FAIL·근거 한 줄·스크린 대신 확인한 UI 텍스트 인용 등, 나중에 읽는 사람이 따라올 수 있게 쓰는 연습입니다.</p>
      </article>
      <article id="learn-sqat-exam" class="learn-section detail-card">
        <h2 class="detail-h2">SQAT 시험</h2>
        <p class="detail-body">출제 범위는 이 연습장의 챕터(화면·API·Swagger·TC)와 맞춰 두었습니다. 실제 시험 정책은 주관 기관 안내를 따르세요.</p>
        <p class="muted small"><a class="inline-link" href="${h.challenges()}">챌린지(심화) →</a></p>
      </article>
    </div>
  </main>`;
}

export function initLearnPage() {
  const params = window.QA.learnerAppSearchParams();
  const section = params.get("section");
  const id = section && SECTION_IDS[section];
  if (!id) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

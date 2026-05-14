/** 토론: 정적 샘플 + ?topic= 앵커 (메가 메뉴와 연동) */
const TOPIC_IDS = {
  severity: "board-topic-severity",
  "tc-design": "board-topic-tc-design",
  "defect-edge": "board-topic-defect-edge",
  free: "board-topic-free"
};

export function getBoardPageHtml() {
  const h = window.QA.learnerHref;
  return `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">토론</h1>
      <p class="site-hero-desc">
        심각도·TC 설계·결함 여부·자유 주제를 나누는 공간입니다. <strong>GitHub Pages 정적 데모</strong>에서는 샘플 카드만 제공하며, 글쓰기·DB는 추후 앱에 붙일 수 있습니다.
      </p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container site-main-narrow board-hub" style="max-width:720px;">
      <ul class="board-topic-list feature-hub-list" style="list-style:none;padding:0;margin:0;">
        <li id="board-topic-severity" class="detail-card board-topic-card" style="margin:0 0 1rem;padding:1rem 1.1rem;">
          <p class="muted small" style="margin:0 0 0.35rem;">심각도 논의 · 샘플</p>
          <strong>재현이 안 되는데 Block으로 올려도 될까요?</strong>
          <p class="small" style="margin:0.5rem 0 0;">사용자 데이터 손실·보안·결제 중단이 없다면 팀 규칙에 따라 Major로 두고 재현 시도 로그를 남기는 편이 안전합니다.</p>
        </li>
        <li id="board-topic-tc-design" class="detail-card board-topic-card" style="margin:0 0 1rem;padding:1rem 1.1rem;">
          <p class="muted small" style="margin:0 0 0.35rem;">TC 설계 기준 · 샘플</p>
          <strong>Given/When/Then을 한 문장으로 써도 되나요?</strong>
          <p class="small" style="margin:0.5rem 0 0;">짧은 스모크는 한 줄로도 되지만, 검증이 두 개면 케이스를 나누는 게 유지보수에 유리합니다.</p>
        </li>
        <li id="board-topic-defect-edge" class="detail-card board-topic-card" style="margin:0 0 1rem;padding:1rem 1.1rem;">
          <p class="muted small" style="margin:0 0 0.35rem;">결함 여부 논의 · 샘플</p>
          <strong>버튼 색만 다르고 동작은 같으면 결함일까요?</strong>
          <p class="small" style="margin:0.5rem 0 0;">스펙에 색이 명시돼 있으면 UI 결함, 아니면 개선 제안으로 분리하는 팀도 많습니다.</p>
        </li>
        <li id="board-topic-free" class="detail-card board-topic-card" style="margin:0;padding:1rem 1.1rem;">
          <p class="muted small" style="margin:0 0 0.35rem;">자유 토론 · 샘플</p>
          <strong>첫 출근한 QA에게 추천하는 첫 미션</strong>
          <p class="small" style="margin:0.5rem 0 0;">문의 폼 한 줄이라도 기대·실제를 적어 보는 시나리오부터 추천합니다.</p>
        </li>
      </ul>
      <p class="muted small" style="margin-top:1.25rem;">메가 메뉴의 토론 항목과 위 카드가 1:1로 대응합니다. <a class="inline-link" href="${h.learn()}">학습 허브</a> · <a class="inline-link" href="${h.home()}">미션</a></p>
    </div>
  </main>`;
}

export function initBoardPage() {
  const params = window.QA.learnerAppSearchParams();
  const topic = params.get("topic");
  const id = topic && TOPIC_IDS[topic];
  if (!id) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

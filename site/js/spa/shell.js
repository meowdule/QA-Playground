const QA = () => window.QA;

function megaLearnLinks(h) {
  return `
        <ul class="mega-item-list">
          <li><a class="mega-item-link" href="${h.learnArticle("concepts")}"><span class="mega-item-title">QA 개념</span><span class="mega-item-desc">용어 / 이론</span></a></li>
          <li><a class="mega-item-link" href="${h.learnArticle("techniques")}"><span class="mega-item-title">테스트 기법</span><span class="mega-item-desc">동등분할 등</span></a></li>
          <li><a class="mega-item-link" href="${h.learnArticle("defect-mgmt")}"><span class="mega-item-title">결함 관리</span><span class="mega-item-desc">심각도 기준</span></a></li>
          <li><a class="mega-item-link" href="${h.learnArticle("reports")}"><span class="mega-item-title">보고서 작성</span><span class="mega-item-desc">PASS/FAIL 기준</span></a></li>
          <li><a class="mega-item-link" href="${h.learnArticle("sqat-exam")}"><span class="mega-item-title">SQAT 시험</span><span class="mega-item-desc">출제 범위 안내</span></a></li>
        </ul>`;
}

function megaMissionLinks(h) {
  return `
        <ul class="mega-item-list">
          <li><a class="mega-item-link" href="${h.home()}"><span class="mega-item-title">시나리오</span><span class="mega-item-desc">TC 수행 실습</span></a></li>
          <li><a class="mega-item-link" data-spa="tc-lab" href="${h.tcLab()}"><span class="mega-item-title">TC 작성</span><span class="mega-item-desc">문서화 실습</span></a></li>
          <li><a class="mega-item-link" href="${h.mission("m_tc_inq_once")}"><span class="mega-item-title">보고서 작성</span><span class="mega-item-desc">결과 기준 입력</span></a></li>
        </ul>`;
}

function megaChallengeLinks(h) {
  return `
        <ul class="mega-item-list">
          <li><a class="mega-item-link" href="${h.challengesTrack("theory")}"><span class="mega-item-title">이론 챌린지</span><span class="mega-item-desc">1과목 대비</span></a></li>
          <li><a class="mega-item-link" href="${h.challengesTrack("tc")}"><span class="mega-item-title">TC 챌린지</span><span class="mega-item-desc">2과목 대비</span></a></li>
          <li><a class="mega-item-link" href="${h.challengesTrack("defect")}"><span class="mega-item-title">결함 챌린지</span><span class="mega-item-desc">3과목 대비</span></a></li>
          <li><a class="mega-item-link" href="${h.challengesTrack("mock")}"><span class="mega-item-title">모의고사</span><span class="mega-item-desc">전과목 시뮬레이션</span></a></li>
        </ul>`;
}

function megaBoardLinks(h) {
  return `
        <ul class="mega-item-list">
          <li><a class="mega-item-link" href="${h.boardTopic("severity")}"><span class="mega-item-title">심각도 논의</span><span class="mega-item-desc">판단 근거 토론</span></a></li>
          <li><a class="mega-item-link" href="${h.boardTopic("tc-design")}"><span class="mega-item-title">TC 설계 기준</span><span class="mega-item-desc">방법론 논의</span></a></li>
          <li><a class="mega-item-link" href="${h.boardTopic("defect-edge")}"><span class="mega-item-title">결함 여부 논의</span><span class="mega-item-desc">경계 케이스</span></a></li>
          <li><a class="mega-item-link" href="${h.boardTopic("free")}"><span class="mega-item-title">자유 토론</span><span class="mega-item-desc">QA 일반</span></a></li>
        </ul>`;
}

export function renderSiteChrome() {
  const h = QA().learnerHref;
  return `
  <header class="site-header site-header--mega">
    <div class="mega-hover-area">
      <div class="site-header-inner site-header-inner--mega-top">
        <a class="site-logo" href="${h.home()}">QA Playground</a>
        <nav class="site-mega-tabs" aria-label="주요 메뉴">
          <a class="mega-tab mega-tab--learn" data-spa="learn" href="${h.learn()}">학습</a>
          <a class="mega-tab mega-tab--missions" data-spa="missions" href="${h.home()}">미션</a>
          <a class="mega-tab mega-tab--challenge" data-spa="challenges" href="${h.challenges()}">챌린지</a>
          <a class="mega-tab mega-tab--board" data-spa="board" href="${h.board()}">토론</a>
        </nav>
        <span id="authNavSlot" class="site-auth-nav"></span>
      </div>
      <div class="mega-panel" role="navigation" aria-label="하위 메뉴">
        <div class="mega-panel-inner">
          <div class="mega-grid">
            <section class="mega-col mega-col--learn" aria-labelledby="mega-col-learn-h">
              <h2 class="mega-col-head" id="mega-col-learn-h">학습</h2>
              ${megaLearnLinks(h)}
            </section>
            <section class="mega-col mega-col--missions" aria-labelledby="mega-col-mission-h">
              <h2 class="mega-col-head" id="mega-col-mission-h">미션</h2>
              ${megaMissionLinks(h)}
            </section>
            <section class="mega-col mega-col--challenge" aria-labelledby="mega-col-challenge-h">
              <h2 class="mega-col-head" id="mega-col-challenge-h">챌린지</h2>
              ${megaChallengeLinks(h)}
            </section>
            <section class="mega-col mega-col--board" aria-labelledby="mega-col-board-h">
              <h2 class="mega-col-head" id="mega-col-board-h">토론</h2>
              ${megaBoardLinks(h)}
            </section>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div id="spa-outlet" class="spa-outlet"></div>
  <footer class="site-footer site-footer--service">
    <div class="site-footer-inner">
      <span class="site-footer-brand">QA Playground</span>
      <nav class="site-footer-nav" aria-label="바로가기">
        <a href="${h.learn()}">학습</a>
        <a href="${h.home()}">미션</a>
        <a href="${h.challenges()}">챌린지</a>
        <a href="${h.board()}">토론</a>
        <a href="${h.tcLab()}">TC 작성</a>
      </nav>
      <p class="site-footer-note">로컬 브라우저에만 진행이 저장됩니다.</p>
    </div>
  </footer>`;
}

export function renderAuthChrome() {
  return `
  <header class="site-header site-header--auth-only">
    <div class="site-header-inner site-header-inner--center">
      <a class="site-logo" href="${QA().learnerHref.home()}">QA Playground</a>
    </div>
  </header>
  <div id="spa-outlet" class="spa-outlet"></div>`;
}

export function setNavActive(routeKey) {
  document.querySelectorAll("[data-spa]").forEach((el) => {
    const k = el.getAttribute("data-spa");
    const on = k === routeKey;
    el.classList.toggle("is-active", on);
    if (on) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
}

const QA = () => window.QA;

function megaLearnLinks(h) {
  const rows = [
    ["concepts", "QA 개념"],
    ["techniques", "테스트 기법"],
    ["defect-mgmt", "결함 관리"],
    ["reports", "보고서 작성"],
    ["sqat-exam", "SQAT 시험"]
  ];
  return rows.map(([slug, label]) => `<a class="mega-drop-link" href="${h.learnArticle(slug)}">${label}</a>`).join("");
}

function megaMissionLinks(h) {
  const rows = [
    [h.home(), "시나리오", false],
    [h.tcLab(), "TC 작성", true],
    [h.mission("m_tc_inq_once"), "보고서 작성", false]
  ];
  return rows
    .map(([href, label, isTc]) =>
      isTc
        ? `<a class="mega-drop-link" data-spa="tc-lab" href="${href}">${label}</a>`
        : `<a class="mega-drop-link" href="${href}">${label}</a>`
    )
    .join("");
}

function megaChallengeLinks(h) {
  const rows = [
    ["theory", "이론 챌린지"],
    ["tc", "TC 챌린지"],
    ["defect", "결함 챌린지"],
    ["mock", "모의고사"]
  ];
  return rows
    .map(([track, label]) => `<a class="mega-drop-link" href="${h.challengesTrack(track)}">${label}</a>`)
    .join("");
}

function megaBoardLinks(h) {
  const rows = [
    ["severity", "심각도 논의"],
    ["tc-design", "TC 설계 기준"],
    ["defect-edge", "결함 여부 논의"],
    ["free", "자유 토론"]
  ];
  return rows.map(([slug, label]) => `<a class="mega-drop-link" href="${h.boardTopic(slug)}">${label}</a>`).join("");
}

/** 터치: 첫 탭은 패널만 토글, 패널이 열린 상태에서 탭하면 링크 이동 */
export function bindMegaDropNav() {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  const nav = document.querySelector(".site-header-nav--drops");
  if (!nav || mq.matches) return;

  nav.querySelectorAll(".mega-drop").forEach((drop) => {
    const a = drop.querySelector(":scope > a.site-nav-link");
    const panel = drop.querySelector(":scope > .mega-drop-panel");
    if (!a || !panel) return;
    a.addEventListener("click", (e) => {
      if (drop.classList.contains("is-open")) {
        drop.classList.remove("is-open");
        return;
      }
      e.preventDefault();
      nav.querySelectorAll(".mega-drop.is-open").forEach((d) => {
        if (d !== drop) d.classList.remove("is-open");
      });
      drop.classList.add("is-open");
    });
  });

  document.addEventListener("click", (e) => {
    if (nav.contains(e.target)) return;
    nav.querySelectorAll(".mega-drop.is-open").forEach((d) => d.classList.remove("is-open"));
  });
}

export function renderSiteChrome() {
  const h = QA().learnerHref;
  return `
  <header class="site-header">
    <div class="site-header-inner site-header-inner--navrow">
      <a class="site-logo" href="${h.home()}">QA Playground</a>
      <nav class="site-header-nav site-header-nav--drops" aria-label="주요 메뉴">
        <div class="mega-drop">
          <a class="site-nav-link" data-spa="learn" href="${h.learn()}">학습</a>
          <div class="mega-drop-panel" role="menu">${megaLearnLinks(h)}</div>
        </div>
        <div class="mega-drop">
          <a class="site-nav-link" data-spa="missions" href="${h.home()}">미션</a>
          <div class="mega-drop-panel" role="menu">${megaMissionLinks(h)}</div>
        </div>
        <div class="mega-drop">
          <a class="site-nav-link" data-spa="challenges" href="${h.challenges()}">챌린지</a>
          <div class="mega-drop-panel" role="menu">${megaChallengeLinks(h)}</div>
        </div>
        <div class="mega-drop">
          <a class="site-nav-link" data-spa="board" href="${h.board()}">토론</a>
          <div class="mega-drop-panel" role="menu">${megaBoardLinks(h)}</div>
        </div>
      </nav>
      <span id="authNavSlot" class="site-auth-nav"></span>
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

const QA = () => window.QA;

export function renderSiteChrome() {
  const h = QA().learnerHref;
  return `
  <header class="site-header site-header--simple">
    <div class="site-header-inner">
      <div class="site-header-brand-row">
        <a class="site-logo" href="${h.home()}">QA Playground</a>
        <nav class="site-header-nav" aria-label="주요 페이지">
          <a class="site-nav-link" data-spa="learn" href="${h.learn()}">학습</a>
          <a class="site-nav-link" data-spa="missions" href="${h.home()}">미션</a>
          <a class="site-nav-link" data-spa="challenges" href="${h.challenges()}">챌린지</a>
          <a class="site-nav-link" data-spa="board" href="${h.board()}">토론</a>
          <span class="site-nav-divider" aria-hidden="true"></span>
          <a class="site-nav-link site-nav-link--sub" data-spa="tc-lab" href="${h.tcLab()}">TC 작성</a>
        </nav>
      </div>
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

import "../core/storage.js";
import "../mission-catalog-enrich.js";
import "../missions.js";
import "../core/learner-href.js";
import "../ui/profile-avatar.js";
import "../ui/auth-nav.js";
import "../ui/prereq-dialog.js";
import "../ui/confirm-dialog.js";

import { parseLearnerRoute } from "./router.js";
import { renderSiteChrome, renderAuthChrome, setNavActive } from "./shell.js";
import { initHomePage } from "../pages/home.js";
import { initMissionPage } from "../pages/mission-detail.js";
import { initTcLabPage } from "../pages/tc-lab.js";
import { initChallengeListPage } from "../pages/challenge-list.js";
import { initLoginPage } from "../pages/login.js";
import { initSignupPage } from "../pages/signup.js";
import { initAccountPage } from "../pages/account.js";

const QA = () => window.QA;

function $(sel, root = document) {
  return root.querySelector(sel);
}

const HOME_MARKUP = `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">시나리오 실습</h1>
      <p class="site-hero-desc">
        기획·QA 입장에서 같은 제품 흐름을 <strong>기능 묶음(과정)</strong>으로 나누었습니다. 화면 탐색·버그 재현·결함 제보 등 목표만 바꿔 가며 같은 연습 데모를 씁니다. <strong>TC 초안 작성</strong>은 상단 <strong>TC 작성</strong> 메뉴에서 따로 진행합니다.
      </p>
      <div class="site-hero-meta" id="heroStats">
        <span class="site-hero-stat"><em id="statCleared">—</em> 클리어</span>
        <span class="site-hero-stat"><em id="statPoints">—</em> 점수</span>
      </div>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container">
      <div class="site-section-head">
        <h2 class="site-section-title">시나리오 기능 묶음 <span class="site-count" id="missionCount">0</span></h2>
        <p class="site-section-desc">
          챕터·난이도·<strong>진행 상태</strong>(수행 전·수행 중·수행 완료)로 묶음을 찾을 수 있습니다. TC 작성 과정은 이 목록에 포함되지 않으며 <strong>TC 작성</strong> 메뉴에서만 열립니다.
        </p>
      </div>
      <div class="catalog-toolbar" role="region" aria-label="카탈로그 필터">
        <div class="catalog-toolbar-inner">
          <label class="catalog-filter">
            <span class="catalog-filter-label">챕터</span>
            <select id="catalogChapterFilter" class="catalog-select" aria-label="챕터 필터"></select>
          </label>
          <label class="catalog-filter">
            <span class="catalog-filter-label">난이도(레벨)</span>
            <select id="catalogLevelFilter" class="catalog-select" aria-label="난이도 필터"></select>
          </label>
          <label class="catalog-filter">
            <span class="catalog-filter-label">진행 상태</span>
            <select id="catalogProgressFilter" class="catalog-select" aria-label="진행 상태 필터"></select>
          </label>
          <button type="button" id="catalogFilterReset" class="btn-site-secondary catalog-filter-reset">
            필터 초기화
          </button>
        </div>
      </div>
      <div id="missionCatalogRoot" class="mission-catalog-root"></div>
    </div>
  </main>`;

function missionMarkup() {
  const h = QA().learnerHref.home();
  return `
  <main class="site-main site-main-narrow">
    <div class="site-container">
      <nav class="breadcrumb" aria-label="경로">
        <a href="${h}">시나리오 실습</a>
        <span class="breadcrumb-sep">/</span>
        <span id="bcTitle">—</span>
      </nav>
      <article id="featureHubRoot" class="detail-card" hidden>
        <header class="detail-head">
          <div class="detail-badges">
            <span class="site-badge is-muted">기능 묶음</span>
          </div>
          <h1 id="hubTitle" class="detail-title">—</h1>
          <p id="hubSummary" class="detail-summary">—</p>
        </header>
        <div id="hubIntro" class="detail-body"></div>
        <section class="detail-section">
          <h2 class="detail-h2">포함된 시나리오</h2>
          <ul id="featureHubList" class="feature-hub-list"></ul>
        </section>
      </article>
      <article id="missionDetailRoot" class="detail-card">
        <p id="detailParentNav" class="detail-parent-nav" hidden>
          <a id="linkBackHub" class="inline-link" href="${h}"></a>
        </p>
        <header class="detail-head">
          <div class="detail-badges">
            <span id="missionType" class="site-badge">—</span>
            <span id="missionDifficulty" class="site-badge is-muted">—</span>
            <span id="missionPoints" class="site-badge is-point">—</span>
            <span id="doneBadge" class="site-badge is-done" hidden>완료</span>
          </div>
          <h1 id="missionTitle" class="detail-title">—</h1>
          <p id="missionSummary" class="detail-summary">—</p>
        </header>
        <div id="bugDefectFollow" class="detail-alert detail-alert--follow" hidden></div>
        <div id="preqNotice" class="detail-alert" hidden></div>
        <div id="missionDescription" class="detail-body"></div>
        <section class="detail-section">
          <h2 class="detail-h2">이 시나리오에서 할 일</h2>
          <ul id="objectivePreview" class="detail-objectives"></ul>
        </section>
        <div class="detail-cta">
          <p id="loginGate" class="detail-gate" hidden>
            실습을 <strong>시작</strong>하려면 로그인이 필요합니다.
            <a class="inline-link" id="linkLoginGate" href="#">로그인</a>
            ·
            <a class="inline-link" id="linkSignupGate" href="#">회원가입</a>
          </p>
          <a id="btnStart" class="btn-site-primary" href="#">실습 시작하기</a>
        </div>
      </article>
    </div>
  </main>`;
}

const TC_MARKUP = `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">TC 작성 실습</h1>
      <p class="site-hero-desc">
        연습 데모 아래에 제시되는 <strong>이번 연습 주제</strong>를 읽고, 같은 흐름을 테스트케이스(TC) 초안으로 옮깁니다. 채점·목표 체크보다
        <strong>문서 작성 연습</strong>에 가깝습니다.
      </p>
      <div class="site-hero-meta" id="heroStats">
        <span class="site-hero-stat"><em id="statTcCleared">—</em> 클리어</span>
        <span class="site-hero-stat"><em id="statTcPoints">—</em> 점수</span>
      </div>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container">
      <div class="site-section-head">
        <h2 class="site-section-title">TC 과정 묶음 <span class="site-count" id="tcLabCount">0</span></h2>
        <p class="site-section-desc">
          묶음을 누르면 포함된 TC 과정 목록으로 들어갑니다. 플레이 화면에서는 활동 로그 없이 데모와 작성 칸만 둡니다.
        </p>
      </div>
      <div id="tcLabCatalogRoot" class="mission-catalog-root"></div>
    </div>
  </main>`;

const CHALLENGE_MARKUP = `
  <section class="site-hero">
    <div class="site-hero-inner">
      <h1 class="site-hero-title">챌린지</h1>
      <p class="site-hero-desc">
        카탈로그에 <code>challenge</code> 가 붙은 시나리오만 모았습니다. 카드를 누르면 확인 후 <strong>바로 플레이(테스트 화면)</strong>로
        들어갑니다. 타이머·실점수는 아직 연결되어 있지 않습니다.
      </p>
    </div>
  </section>
  <main class="site-main">
    <div class="site-container">
      <div id="challengeCatalogRoot" class="mission-catalog-root"></div>
    </div>
  </main>`;

const LOGIN_MARKUP = `
  <main class="site-main site-main-auth">
    <div class="auth-shell">
      <h1 class="auth-title">로그인</h1>
      <p id="nextHint" class="auth-sub muted" hidden></p>
      <form id="formLogin" class="auth-form-site">
        <label class="auth-label">이메일
          <input name="email" type="email" autocomplete="username" required class="auth-input" />
        </label>
        <label class="auth-label">비밀번호
          <input name="password" type="password" autocomplete="current-password" required class="auth-input" />
        </label>
        <button type="submit" class="btn-site-primary btn-site-block">로그인</button>
      </form>
      <p class="muted small">데모 일반 계정: demo@qa.playground / demo1234!</p>
      <p class="muted small">관리자 계정: admin@qa.playground / admin1234!</p>
      <p class="auth-footer-link">
        계정이 없으신가요? <a id="linkSignup" href="#">회원가입</a>
      </p>
    </div>
  </main>`;

const SIGNUP_MARKUP = `
  <main class="site-main site-main-auth">
    <div class="auth-shell">
      <h1 class="auth-title">회원가입</h1>
      <p class="auth-sub muted">진행도는 이 브라우저에만 저장됩니다.</p>
      <form id="formSignup" class="auth-form-site">
        <label class="auth-label">이메일
          <input name="email" type="email" autocomplete="username" required class="auth-input" />
        </label>
        <label class="auth-label">비밀번호 (6자 이상)
          <input name="password" type="password" autocomplete="new-password" minlength="6" required class="auth-input" />
        </label>
        <label class="auth-label">표시 이름
          <input name="displayName" type="text" maxlength="24" required class="auth-input" />
        </label>
        <button type="submit" class="btn-site-primary btn-site-block">가입하기</button>
      </form>
      <p class="auth-footer-link">
        이미 계정이 있나요? <a id="linkLogin" href="#">로그인</a>
      </p>
    </div>
  </main>`;

const ACCOUNT_MARKUP = `
  <main class="site-main site-main-auth">
    <div class="auth-shell">
      <h1 class="auth-title">정보 수정</h1>
      <p id="accountEmail" class="auth-sub muted"></p>
      <form id="formAccount" class="auth-form-site">
        <label class="auth-label">표시 이름 (닉네임)
          <input name="displayName" id="accountName" type="text" maxlength="24" required class="auth-input" />
        </label>
        <button type="submit" class="btn-site-primary btn-site-block">저장</button>
      </form>
      <p class="auth-footer-link"><a id="linkBack" href="#">← 돌아가기</a></p>
    </div>
  </main>`;

function bindSpaNavClicks() {
  const shell = document.getElementById("spa-shell");
  if (!shell) return;
  shell.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    const idx = href.indexOf("#/");
    if (idx < 0) return;
    const hashPart = href.slice(idx);
    e.preventDefault();
    if (location.hash !== hashPart) location.hash = hashPart;
  });
}

function mountShell(siteMode) {
  const root = $("#spa-shell");
  if (!root) return;
  root.innerHTML = siteMode ? renderSiteChrome() : renderAuthChrome();
  bindSpaNavClicks();
}

function route() {
  const { path, query } = parseLearnerRoute();
  const p = path === "/" ? "/home" : path;

  if (p === "/login" || p === "/signup" || p === "/account") {
    mountShell(false);
    document.body.className = "page-site";
    const out = $("#spa-outlet");
    if (!out) return;
    if (p === "/login") {
      out.innerHTML = LOGIN_MARKUP;
      document.title = "로그인 · QA Playground";
      initLoginPage(query);
    } else if (p === "/signup") {
      out.innerHTML = SIGNUP_MARKUP;
      document.title = "회원가입 · QA Playground";
      initSignupPage(query);
    } else {
      out.innerHTML = ACCOUNT_MARKUP;
      document.title = "계정 정보 · QA Playground";
      initAccountPage(query);
    }
    return;
  }

  mountShell(true);
  document.body.className = "page-site";
  const out = $("#spa-outlet");
  if (!out) return;

  if (p === "/home" || p === "") {
    out.innerHTML = HOME_MARKUP;
    document.title = "QA Playground — 시나리오 실습";
    setNavActive("home");
    initHomePage();
    return;
  }

  if (p === "/mission") {
    out.innerHTML = missionMarkup();
    setNavActive("home");
    initMissionPage(query);
    return;
  }

  if (p === "/tc-lab") {
    out.innerHTML = TC_MARKUP;
    document.title = "TC 작성 실습 · QA Playground";
    setNavActive("tc-lab");
    initTcLabPage();
    return;
  }

  if (p === "/challenges") {
    out.innerHTML = CHALLENGE_MARKUP;
    document.title = "챌린지 · QA Playground";
    setNavActive("challenges");
    initChallengeListPage();
    return;
  }

  out.innerHTML = HOME_MARKUP;
  document.title = "QA Playground — 시나리오 실습";
  setNavActive("home");
  initHomePage();
}

window.addEventListener("hashchange", route);
route();

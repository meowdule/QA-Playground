const ROUTE_LABELS = {
  landing: "랜딩",
  contact: "문의하기",
  apply: "지금 신청하기",
  plans: "구매 플랜 조회",
  signup: "회원가입",
  login: "로그인",
  board: "게시판",
  post: "게시글",
  profile: "프로필"
};

const ALL_NAV = [
  { route: "landing", label: "홈", navKind: "target" },
  { route: "contact", label: "문의", navKind: "target" },
  { route: "apply", label: "신청", navKind: "target" },
  { route: "plans", label: "구매 플랜", navKind: "plans_bug" },
  { route: "signup", label: "가입", navKind: "target" },
  { route: "login", label: "로그인", navKind: "target" },
  { route: "board", label: "게시판", navKind: "target" },
  { route: "profile", label: "프로필", navKind: "target" }
];

class SandboxApp {
  constructor(container, mission, profileProgress, onUpdate) {
    this.container = container;
    this.mission = mission;
    this.profileProgress = profileProgress || {};
    this.onUpdate = onUpdate || (() => {});
    this.toastTimer = null;
    this.state = this.buildInitialState();
    this.render();
  }

  allowed(route) {
    const list = this.mission.sandbox?.allowedRoutes;
    if (!list || !list.length) return true;
    return list.includes(route);
  }

  buildInitialState() {
    const m = this.mission.sandbox || {};
    const st = {
      route: "landing",
      visited: [],
      contactFormSubmitted: false,
      applyFormSubmitted: false,
      signupCompletedValid: false,
      signupInvalidBugReproduced: false,
      loginCompleted: false,
      wrongPlanNavObserved: false,
      flakyCtaObserved: false,
      trialHeroClicks: 0,
      users: {},
      currentUser: null,
      posts: [],
      comments: [],
      activePostId: null,
      postCreated: false,
      postEdited: false,
      postDeleted: false,
      commentAdded: false,
      commentEdited: false,
      commentDeleted: false,
      profileUpdated: false,
      lastRegisteredEmail: null,
      lastRegisteredName: null,
      deletedPostIds: new Set(),
      editedPostIds: new Set(),
      editedCommentIds: new Set(),
      deletedCommentIds: new Set(),
      sessionHadLoginSuccess: false,
      logoutPerformed: false,
      loginFailureCount: 0,
      contactSubmitCount: 0,
      applySubmitCount: 0,
      signupWeakPasswordRejected: false,
      contactEmptySubmitBugReproduced: false,
      applyEmptySubmitBugReproduced: false,
      wrongHeroApplyNavObserved: false,
      wrongHeroPlansNavObserved: false,
      loginFalseSuccessBugReproduced: false,
      boardEmptyWhileHasPostsBugObserved: false,
      wrongAuthorOnPostBugObserved: false,
      commentDoubleSubmitBugReproduced: false,
      profileFakeSaveBugReproduced: false
    };

    if (m.seedDemoUser) {
      const u = m.seedDemoUser;
      st.users[u.email.toLowerCase()] = { name: u.name, password: u.password };
    }
    if (Array.isArray(m.seedUsers)) {
      m.seedUsers.forEach((u) => {
        st.users[u.email.toLowerCase()] = { name: u.name, password: u.password };
      });
    }
    const le = this.profileProgress.lastSignupEmail;
    const ln = this.profileProgress.lastSignupName || "가입자";
    if (le) {
      st.users[le.toLowerCase()] = { name: ln, password: "password123" };
    }

    if (m.preLoginSession) {
      const email = m.preLoginSession.email;
      st.currentUser = { email, name: m.preLoginSession.name || st.users[email.toLowerCase()]?.name || "사용자" };
      st.sessionHadLoginSuccess = true;
    }

    if (Array.isArray(m.seedPosts)) {
      st.posts = m.seedPosts.map((p) => ({ ...p }));
    }
    if (Array.isArray(m.seedComments)) {
      st.comments = m.seedComments.map((c) => ({ ...c }));
    }

    if (!st.visited.includes("landing")) {
      st.visited.push("landing");
    }
    return st;
  }

  touchVisited(route) {
    if (!this.state.visited.includes(route)) {
      this.state.visited.push(route);
    }
  }

  goRoute(route, source) {
    if (!this.allowed(route)) {
      this.toast("이 미션에서는 이 기능(화면)을 사용할 수 없습니다.", "error");
      return;
    }
    if (["board", "post", "profile"].includes(route) && !this.state.currentUser) {
      this.toast("로그인이 필요합니다.", "error");
      return;
    }
    if (route === "board" && this.mission.sandbox?.bugBoardEmptyList) {
      const visible = this.state.posts.filter((p) => !this.state.deletedPostIds.has(p.id));
      if (visible.length > 0) {
        this.state.boardEmptyWhileHasPostsBugObserved = true;
      }
    }
    this.state.route = route;
    this.touchVisited(route);
    if (route !== "post") this.state.activePostId = null;
    this.render();
    this.onUpdate(`이동: ${ROUTE_LABELS[route] || route} (${source})`);
  }

  openPost(postId) {
    if (!this.allowed("post") && !this.allowed("board")) {
      this.toast("이 미션에서는 게시글을 열 수 없습니다.", "error");
      return;
    }
    if (!this.state.currentUser) {
      this.toast("로그인이 필요합니다.", "error");
      return;
    }
    if (this.mission.sandbox?.bugWrongPostAuthor) {
      this.state.wrongAuthorOnPostBugObserved = true;
    }
    this.state.activePostId = postId;
    this.state.route = "post";
    this.touchVisited("post");
    this.render();
    this.onUpdate("게시글 열기");
  }

  resetToInitial(silent) {
    this.state = this.buildInitialState();
    this.render();
    if (!silent) {
      this.onUpdate("연습 화면을 처음 상태로 되돌렸습니다.");
    }
  }

  handleNavPlansClick() {
    this.state.wrongPlanNavObserved = true;
    if (!this.allowed("contact")) {
      this.toast("이 미션에서는 이 메뉴를 쓸 수 없습니다.", "error");
      return;
    }
    this.state.route = "contact";
    this.touchVisited("contact");
    this.render();
    this.onUpdate("상단 「구매 플랜」→ 문의 화면으로 연결됨(버그)");
  }

  heroClick(kind) {
    if (kind === "apply" && this.mission.sandbox?.bugHeroApplyToPlans) {
      if (!this.allowed("plans")) {
        this.toast("이 미션에서는 이 버튼으로 이동할 수 없습니다.", "error");
        return;
      }
      this.state.wrongHeroApplyNavObserved = true;
      this.goRoute("plans", "히어로:apply→플랜(버그)");
      return;
    }
    if (kind === "plans" && this.mission.sandbox?.bugHeroPlansToContact) {
      if (!this.allowed("contact")) {
        this.toast("이 미션에서는 이 버튼으로 이동할 수 없습니다.", "error");
        return;
      }
      this.state.wrongHeroPlansNavObserved = true;
      this.goRoute("contact", "히어로:plans→문의(버그)");
      return;
    }
    const map = {
      apply: "apply",
      contact: "contact",
      plans: "plans",
      trial: "signup"
    };
    if (kind === "trial") {
      this.state.trialHeroClicks += 1;
      if (this.state.trialHeroClicks === 1) {
        this.state.flakyCtaObserved = true;
        this.toast("일시 오류입니다. 같은 버튼을 한 번 더 눌러 주세요.", "warn");
        this.render();
        this.onUpdate("체험하기 첫 클릭: 경고만 표시");
        return;
      }
    }
    const route = map[kind];
    if (!this.allowed(route)) {
      this.toast("이 미션에서는 이 버튼으로 이동할 수 없습니다.", "error");
      return;
    }
    this.goRoute(route, `히어로:${kind}`);
  }

  toast(msg, type = "success") {
    const old = document.querySelector(".seo-toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = `seo-toast ${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.remove(), 2800);
  }

  getSnapshot() {
    const s = this.state;
    return {
      visited: [...s.visited],
      contactFormSubmitted: s.contactFormSubmitted,
      applyFormSubmitted: s.applyFormSubmitted,
      signupCompletedValid: s.signupCompletedValid,
      signupInvalidBugReproduced: s.signupInvalidBugReproduced,
      loginCompleted: s.loginCompleted === true,
      wrongPlanNavObserved: s.wrongPlanNavObserved,
      flakyCtaObserved: s.flakyCtaObserved,
      postCreated: s.postCreated,
      postEdited: s.postEdited,
      postDeleted: s.postDeleted,
      commentAdded: s.commentAdded,
      commentEdited: s.commentEdited,
      commentDeleted: s.commentDeleted,
      profileUpdated: s.profileUpdated,
      sessionHadLoginSuccess: s.sessionHadLoginSuccess,
      logoutPerformed: s.logoutPerformed,
      loginFailureCount: s.loginFailureCount,
      contactSubmitCount: s.contactSubmitCount,
      applySubmitCount: s.applySubmitCount,
      signupWeakPasswordRejected: s.signupWeakPasswordRejected,
      contactEmptySubmitBugReproduced: s.contactEmptySubmitBugReproduced,
      applyEmptySubmitBugReproduced: s.applyEmptySubmitBugReproduced,
      wrongHeroApplyNavObserved: s.wrongHeroApplyNavObserved,
      wrongHeroPlansNavObserved: s.wrongHeroPlansNavObserved,
      loginFalseSuccessBugReproduced: s.loginFalseSuccessBugReproduced,
      boardEmptyWhileHasPostsBugObserved: s.boardEmptyWhileHasPostsBugObserved,
      wrongAuthorOnPostBugObserved: s.wrongAuthorOnPostBugObserved,
      commentDoubleSubmitBugReproduced: s.commentDoubleSubmitBugReproduced,
      profileFakeSaveBugReproduced: s.profileFakeSaveBugReproduced
    };
  }

  render() {
    const { state } = this;
    const mission = this.mission;
    const contactRequired = !mission.sandbox?.bugAcceptEmptyContact;
    const applyRequired = !mission.sandbox?.bugAcceptEmptyApply;

    const navHtml = ALL_NAV.map((item) => {
      let allowed = this.allowed(item.route);
      if (item.route === "board" || item.route === "profile") {
        allowed = allowed && !!state.currentUser;
      }
      if (item.route === "post") return "";
      const active = state.route === item.route || (item.route === "board" && state.route === "post");
      const cls = active ? "active" : "";
      const dis = allowed ? "" : "disabled";
      if (item.navKind === "plans_bug") {
        return `<button type="button" class="seo-nav-btn ${cls} ${dis}" data-nav="plans-bug" ${allowed ? "" : "disabled"}>${item.label}</button>`;
      }
      return `<button type="button" class="seo-nav-btn ${cls} ${dis}" data-go="${item.route}" ${allowed ? "" : "disabled"}>${item.label}</button>`;
    }).join("");

    const lockSession = !!mission.sandbox?.preLoginSession;
    const userBar = state.currentUser
      ? `<span class="seo-user">${state.currentUser.name} (${state.currentUser.email})</span>${
          lockSession
            ? '<span class="seo-user muted small">(이 미션은 로그인 상태 고정)</span>'
            : '<button type="button" class="seo-logout" data-action="logout">로그아웃</button>'
        }`
      : `<span class="seo-user muted">비로그인</span>`;

    const visibleBoardPosts = state.posts.filter((p) => !state.deletedPostIds.has(p.id));
    const forceEmptyBoard = !!(mission.sandbox?.bugBoardEmptyList && visibleBoardPosts.length > 0);
    const boardList =
      visibleBoardPosts.length === 0 || forceEmptyBoard
        ? "<p class=\"empty\">게시글이 없습니다.</p>"
        : `<ul class="post-list">${visibleBoardPosts
            .map(
              (p) =>
                `<li><button type="button" class="linkish" data-open-post="${p.id}">${escapeHtml(p.title)}</button> <span class="meta">${escapeHtml(p.authorEmail)}</span></li>`
            )
            .join("")}</ul>`;

    const postDetail = (() => {
      const pid = state.activePostId;
      const post = state.posts.find((p) => p.id === pid);
      if (!post || state.deletedPostIds.has(post.id)) return "<p>글을 찾을 수 없습니다.</p>";
      const isAuthor = state.currentUser && post.authorEmail === state.currentUser.email;
      const comments = state.comments.filter((c) => c.postId === pid);
      const commentHtml = comments
        .filter((c) => !state.deletedCommentIds.has(c.id))
        .map((c) => {
          const mine = state.currentUser && c.authorEmail === state.currentUser.email;
          return `<li class="comment-item" data-cid="${c.id}">
            <p>${escapeHtml(c.body)}</p>
            <span class="meta">${escapeHtml(c.authorEmail)}</span>
            ${
              mine
                ? `<div class="row-mini"><button type="button" data-edit-comment="${c.id}">댓글 수정</button><button type="button" data-del-comment="${c.id}">댓글 삭제</button></div>`
                : ""
            }
          </li>`;
        })
        .join("");

      const authorDisp =
        mission.sandbox?.bugWrongPostAuthor ? "other.user@wrong.demo (실제와 다름)" : post.authorEmail;
      return `
        <h2>${escapeHtml(post.title)}</h2>
        <p class="meta">작성자 ${escapeHtml(authorDisp)}</p>
        <div class="post-body">${escapeHtml(post.body)}</div>
        ${
          isAuthor
            ? `<div class="row-mini"><button type="button" data-edit-post="${post.id}">글 수정</button><button type="button" data-del-post="${post.id}">글 삭제</button></div>`
            : ""
        }
        <h3>댓글</h3>
        <ul class="comment-list">${commentHtml || "<li class=\"empty\">댓글이 없습니다.</li>"}</ul>
        ${
          state.currentUser
            ? `<form class="seo-form comment-form" data-comment-post="${post.id}">
            <label>새 댓글<textarea name="body" rows="2" required></textarea></label>
            <button type="submit" class="seo-submit">댓글 등록</button>
          </form>`
            : ""
        }
      `;
    })();

    this.container.innerHTML = `
      <div class="seo-demo">
        <header class="seo-top">
          <div class="seo-logo">SEO <span>DEMO</span> <small class="mission-tag">연습</small></div>
          <nav class="seo-nav" aria-label="주 메뉴">${navHtml}</nav>
          <div class="seo-session">${userBar}</div>
        </header>
        <section class="seo-hero">
          <h1>빠르게 검증하고, 아름답게 확장하세요.</h1>
          <p>미션별로 사용할 수 있는 메뉴가 다릅니다. 비활성 항목은 이 미션에서 의도적으로 막힌 상태입니다.</p>
          <div class="seo-cta-row">
            <button type="button" class="seo-cta primary" data-hero="apply">지금 신청하기</button>
            <button type="button" class="seo-cta" data-hero="contact">문의하기</button>
            <button type="button" class="seo-cta" data-hero="plans">구매 플랜 조회</button>
            <button type="button" class="seo-cta" data-hero="trial">체험하기</button>
          </div>
        </section>
        <div class="seo-body">
          <section class="seo-view ${state.route === "landing" ? "active" : ""}" data-view="landing">
            <h2>왜 이 데모인가요?</h2>
            <p class="desc">QA Playground용 정적 데모입니다. 왼쪽 미션 설명과 비교하며 탐색해 보세요.</p>
            <p class="route-disp">현재 화면: <strong>${ROUTE_LABELS[state.route]}</strong></p>
          </section>
          <section class="seo-view ${state.route === "contact" ? "active" : ""}" data-view="contact">
            <h2>문의하기</h2>
            <form class="seo-form" id="form-contact">
              <label>제목<input name="title" ${contactRequired ? "required" : ""} /></label>
              <label>내용<textarea name="body" ${contactRequired ? "required" : ""}></textarea></label>
              <button type="submit" class="seo-submit">문의 보내기</button>
            </form>
          </section>
          <section class="seo-view ${state.route === "apply" ? "active" : ""}" data-view="apply">
            <h2>지금 신청하기</h2>
            <form class="seo-form" id="form-apply">
              <label>이름<input name="name" ${applyRequired ? "required" : ""} /></label>
              <label>이메일<input name="email" type="email" ${applyRequired ? "required" : ""} /></label>
              <label>요청 사항<textarea name="note"></textarea></label>
              <button type="submit" class="seo-submit">신청 보내기</button>
            </form>
          </section>
          <section class="seo-view ${state.route === "plans" ? "active" : ""}" data-view="plans">
            <h2>구매 플랜 조회</h2>
            <div class="plan-grid">
              <div class="plan-card"><h3>Starter</h3><p>개인·소규모.</p></div>
              <div class="plan-card"><h3>Pro</h3><p>성장 단계.</p></div>
              <div class="plan-card"><h3>Team</h3><p>협업·권한.</p></div>
            </div>
          </section>
          <section class="seo-view ${state.route === "signup" ? "active" : ""}" data-view="signup">
            <h2>회원가입</h2>
            <form class="seo-form" id="form-signup">
              <label>이름<input name="name" required /></label>
              <label>이메일<input name="email" type="text" placeholder="you@example.com" /></label>
              <label>비밀번호<input name="password" type="password" placeholder="8자 이상" /></label>
              <button type="submit" class="seo-submit">가입하기</button>
            </form>
          </section>
          <section class="seo-view ${state.route === "login" ? "active" : ""}" data-view="login">
            <h2>로그인</h2>
            <p class="desc">가입 미션에서 쓴 이메일과 비밀번호 password123 또는 데모 계정 demo@qa.test / password123</p>
            <form class="seo-form" id="form-login">
              <label>이메일<input name="email" type="email" required /></label>
              <label>비밀번호<input name="password" type="password" required /></label>
              <button type="submit" class="seo-submit">로그인</button>
            </form>
          </section>
          <section class="seo-view ${state.route === "board" ? "active" : ""}" data-view="board">
            <h2>게시판</h2>
            ${
              state.currentUser
                ? `<button type="button" class="seo-submit secondary" data-action="new-post">새 글 작성</button>`
                : ""
            }
            ${boardList}
            <div id="new-post-wrap" class="hidden"></div>
          </section>
          <section class="seo-view ${state.route === "post" ? "active" : ""}" data-view="post">
            ${postDetail}
          </section>
          <section class="seo-view ${state.route === "profile" ? "active" : ""}" data-view="profile">
            <h2>프로필</h2>
            ${
              state.currentUser
                ? `<form class="seo-form" id="form-profile">
              <label>이메일 (읽기 전용)<input name="email" readonly value="${escapeHtml(state.currentUser.email)}" /></label>
              <label>표시 이름<input name="name" value="${escapeHtml(state.currentUser.name)}" required /></label>
              <button type="submit" class="seo-submit">프로필 저장</button>
            </form>`
                : "<p>로그인이 필요합니다.</p>"
            }
          </section>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const root = this.container;

    root.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => this.goRoute(btn.dataset.go, "상단 메뉴"));
    });
    const bugBtn = root.querySelector("[data-nav='plans-bug']");
    if (bugBtn) {
      bugBtn.addEventListener("click", () => this.handleNavPlansClick());
    }

    root.querySelectorAll("[data-hero]").forEach((btn) => {
      btn.addEventListener("click", () => this.heroClick(btn.dataset.hero));
    });

    const logout = root.querySelector("[data-action='logout']");
    if (logout) {
      logout.addEventListener("click", () => {
        this.state.logoutPerformed = true;
        this.state.currentUser = null;
        this.state.loginCompleted = false;
        this.goRoute("landing", "로그아웃");
        this.toast("로그아웃되었습니다.", "success");
        this.onUpdate("로그아웃 완료");
      });
    }

    const newPostBtn = root.querySelector("[data-action='new-post']");
    if (newPostBtn) {
      newPostBtn.addEventListener("click", () => this.showNewPostForm());
    }

    root.querySelectorAll("[data-open-post]").forEach((btn) => {
      btn.addEventListener("click", () => this.openPost(btn.dataset.openPost));
    });

    root.querySelectorAll("[data-edit-post]").forEach((btn) => {
      btn.addEventListener("click", () => this.promptEditPost(btn.dataset.editPost));
    });
    root.querySelectorAll("[data-del-post]").forEach((btn) => {
      btn.addEventListener("click", () => this.deletePost(btn.dataset.delPost));
    });
    root.querySelectorAll("[data-edit-comment]").forEach((btn) => {
      btn.addEventListener("click", () => this.promptEditComment(btn.dataset.editComment));
    });
    root.querySelectorAll("[data-del-comment]").forEach((btn) => {
      btn.addEventListener("click", () => this.deleteComment(btn.dataset.delComment));
    });

    const fc = root.querySelector("#form-contact");
    if (fc) {
      fc.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fc);
        const title = String(fd.get("title") || "").trim();
        const body = String(fd.get("body") || "").trim();
        if (this.mission.sandbox?.bugAcceptEmptyContact && !title && !body) {
          this.state.contactEmptySubmitBugReproduced = true;
        }
        this.state.contactSubmitCount += 1;
        this.state.contactFormSubmitted = true;
        this.toast("문의가 전달되었습니다. (데모)", "success");
        this.onUpdate("문의 폼 제출");
        this.render();
      });
    }
    const fa = root.querySelector("#form-apply");
    if (fa) {
      fa.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fa);
        const name = String(fd.get("name") || "").trim();
        const email = String(fd.get("email") || "").trim();
        const note = String(fd.get("note") || "").trim();
        if (this.mission.sandbox?.bugAcceptEmptyApply && !name && !email && !note) {
          this.state.applyEmptySubmitBugReproduced = true;
        }
        this.state.applySubmitCount += 1;
        this.state.applyFormSubmitted = true;
        this.toast("신청이 접수되었습니다. (데모)", "success");
        this.onUpdate("신청 폼 제출");
        this.render();
      });
    }
    const fs = root.querySelector("#form-signup");
    if (fs) {
      fs.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fs);
        const name = String(fd.get("name") || "").trim();
        const email = String(fd.get("email") || "").trim();
        const password = String(fd.get("password") || "");
        const hasAt = email.includes("@");

        if (!hasAt) {
          this.state.signupInvalidBugReproduced = true;
          this.toast("회원가입이 완료되었습니다! 환영합니다.", "success");
          this.onUpdate("버그: 잘못된 이메일인데 성공 토스트");
          this.render();
          return;
        }
        if (password.length < 8) {
          this.state.signupWeakPasswordRejected = true;
          this.toast("비밀번호는 8자 이상이어야 합니다.", "error");
          this.onUpdate("가입 검증: 짧은 비밀번호 거절");
          this.render();
          return;
        }
        this.state.users[email.toLowerCase()] = { name, password };
        this.state.signupCompletedValid = true;
        this.state.lastRegisteredEmail = email;
        this.state.lastRegisteredName = name;
        this.toast("가입이 완료되었습니다. 로그인 미션에서 같은 이메일을 쓸 수 있습니다.", "success");
        this.onUpdate(`가입 완료: ${email}`);
        fs.reset();
        this.render();
      });
    }
    const fl = root.querySelector("#form-login");
    if (fl) {
      fl.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fl);
        const email = String(fd.get("email") || "").trim().toLowerCase();
        const password = String(fd.get("password") || "");
        const u = this.state.users[email];
        if (!u || u.password !== password) {
          if (this.mission.sandbox?.bugLoginFalseSuccess) {
            this.state.loginFalseSuccessBugReproduced = true;
            this.toast("로그인되었습니다.", "success");
            this.onUpdate("버그: 실패인데 성공 토스트");
            this.render();
            return;
          }
          this.state.loginFailureCount += 1;
          this.toast("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
          this.onUpdate("로그인 실패(시도 누적)");
          this.render();
          return;
        }
        this.state.currentUser = { email, name: u.name };
        this.state.loginCompleted = true;
        this.state.sessionHadLoginSuccess = true;
        this.toast("로그인되었습니다.", "success");
        this.onUpdate("로그인 성공");
        this.render();
      });
    }
    const fp = root.querySelector("#form-profile");
    if (fp) {
      fp.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fp);
        const name = String(fd.get("name") || "").trim();
        if (this.mission.sandbox?.bugProfileFakeSave) {
          this.state.profileFakeSaveBugReproduced = true;
          this.toast("프로필이 저장되었습니다.", "success");
          this.onUpdate("버그: 저장 토스트만 뜨고 반영 안 됨");
          this.render();
          return;
        }
        if (name && name !== this.state.currentUser.name) {
          this.state.profileUpdated = true;
          this.state.currentUser.name = name;
          this.toast("프로필이 저장되었습니다.", "success");
          this.onUpdate("프로필 수정");
        } else {
          this.toast("변경된 내용이 없습니다.", "warn");
        }
        this.render();
      });
    }
    root.querySelectorAll(".comment-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const pid = form.dataset.commentPost;
        const body = String(new FormData(form).get("body") || "").trim();
        if (!body) return;
        const id = `c_${Date.now()}`;
        const entry = {
          id,
          postId: pid,
          body,
          authorEmail: this.state.currentUser.email
        };
        if (this.mission.sandbox?.bugCommentDoublePost) {
          this.state.commentDoubleSubmitBugReproduced = true;
          this.state.comments.push(entry, {
            ...entry,
            id: `${id}_dup`,
            body: `${body} (중복)`
          });
        } else {
          this.state.comments.push(entry);
        }
        this.state.commentAdded = true;
        form.reset();
        this.toast("댓글이 등록되었습니다.", "success");
        this.onUpdate("댓글 등록");
        this.render();
      });
    });
  }

  showNewPostForm() {
    const wrap = this.container.querySelector("#new-post-wrap");
    if (!wrap) return;
    wrap.classList.remove("hidden");
    wrap.innerHTML = `
      <form class="seo-form" id="form-new-post">
        <h3>새 글</h3>
        <label>제목<input name="title" required /></label>
        <label>본문<textarea name="body" required rows="4"></textarea></label>
        <button type="submit" class="seo-submit">등록</button>
      </form>
    `;
    wrap.querySelector("#form-new-post").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const title = String(fd.get("title") || "").trim();
      const body = String(fd.get("body") || "").trim();
      const id = `p_${Date.now()}`;
      this.state.posts.push({
        id,
        title,
        body,
        authorEmail: this.state.currentUser.email
      });
      this.state.postCreated = true;
      wrap.innerHTML = "";
      wrap.classList.add("hidden");
      this.toast("글이 등록되었습니다.", "success");
      this.onUpdate("게시글 작성");
      this.render();
    });
  }

  promptEditPost(postId) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (!post) return;
    const title = window.prompt("제목", post.title);
    if (title === null) return;
    const body = window.prompt("본문", post.body);
    if (body === null) return;
    post.title = title;
    post.body = body;
    this.state.editedPostIds.add(postId);
    this.state.postEdited = true;
    this.toast("글이 수정되었습니다.", "success");
    this.onUpdate("게시글 수정");
    this.render();
  }

  deletePost(postId) {
    if (!window.confirm("이 글을 삭제할까요?")) return;
    this.state.deletedPostIds.add(postId);
    this.state.postDeleted = true;
    this.toast("글이 삭제되었습니다.", "success");
    this.onUpdate("게시글 삭제");
    this.state.route = "board";
    this.state.activePostId = null;
    this.render();
  }

  promptEditComment(commentId) {
    const c = this.state.comments.find((x) => x.id === commentId);
    if (!c) return;
    const body = window.prompt("댓글 내용", c.body);
    if (body === null || !body.trim()) return;
    c.body = body.trim();
    this.state.editedCommentIds.add(commentId);
    this.state.commentEdited = true;
    this.toast("댓글이 수정되었습니다.", "success");
    this.onUpdate("댓글 수정");
    this.render();
  }

  deleteComment(commentId) {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    this.state.deletedCommentIds.add(commentId);
    this.state.commentDeleted = true;
    this.toast("댓글이 삭제되었습니다.", "success");
    this.onUpdate("댓글 삭제");
    this.render();
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.QA = window.QA || {};
window.QA.SandboxApp = SandboxApp;

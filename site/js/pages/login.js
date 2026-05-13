export function initLoginPage(query) {
  const QA = window.QA;
  const params = query || QA.learnerAppSearchParams();
  const nextRaw = params.get("next") || "";

  function redirectAfterLogin() {
    if (QA.isAdminLoggedIn()) {
      window.location.href = "./admin-missions.html";
      return;
    }
    if (!nextRaw) {
      window.location.href = QA.learnerHref.home();
      return;
    }
    if (nextRaw.startsWith("http://") || nextRaw.startsWith("https://")) {
      window.location.href = QA.learnerHref.home();
      return;
    }
    window.location.href = "./" + nextRaw.replace(/^\.\//, "");
  }

  const form = document.getElementById("formLogin");
  const nextHint = document.getElementById("nextHint");

  if (nextRaw) {
    nextHint.hidden = false;
    nextHint.textContent = "로그인 후 이전에 보던 화면으로 이동합니다.";
  }

  const signupLink = document.getElementById("linkSignup");
  if (signupLink) {
    signupLink.href = QA.learnerHref.signup(nextRaw || undefined);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      QA.loginUser(fd.get("email"), fd.get("password"));
      redirectAfterLogin();
    } catch (err) {
      alert(err.message || String(err));
    }
  });
}

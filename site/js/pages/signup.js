export function initSignupPage(query) {
  const QA = window.QA;
  const params = query || QA.learnerAppSearchParams();
  const nextRaw = params.get("next") || "";

  function redirectAfterSignup() {
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

  const form = document.getElementById("formSignup");

  const loginLink = document.getElementById("linkLogin");
  if (loginLink) {
    loginLink.href = QA.learnerHref.login(nextRaw || undefined);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      QA.registerUser(fd.get("email"), fd.get("password"), fd.get("displayName"));
      redirectAfterSignup();
    } catch (err) {
      alert(err.message || String(err));
    }
  });
}

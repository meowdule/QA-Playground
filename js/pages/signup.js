(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const nextRaw = params.get("next") || "index.html";

  function redirectAfterSignup() {
    if (!nextRaw || nextRaw === "index.html") {
      window.location.href = "./index.html";
      return;
    }
    if (nextRaw.startsWith("http://") || nextRaw.startsWith("https://")) {
      window.location.href = "./index.html";
      return;
    }
    window.location.href = "./" + nextRaw.replace(/^\.\//, "");
  }

  const form = document.getElementById("formSignup");

  const loginLink = document.getElementById("linkLogin");
  if (loginLink) {
    loginLink.href = `./login.html?next=${encodeURIComponent(nextRaw)}`;
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
})();


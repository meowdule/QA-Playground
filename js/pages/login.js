(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const nextRaw = params.get("next") || "index.html";

  function redirectAfterLogin() {
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

  const form = document.getElementById("formLogin");
  const nextHint = document.getElementById("nextHint");

  if (nextRaw !== "index.html") {
    nextHint.hidden = false;
    nextHint.textContent = "로그인 후 이전에 보던 화면으로 이동합니다.";
  }

  const signupLink = document.getElementById("linkSignup");
  if (signupLink) {
    signupLink.href = `./signup.html?next=${encodeURIComponent(nextRaw)}`;
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
})();


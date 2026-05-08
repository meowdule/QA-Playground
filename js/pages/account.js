(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const nextRaw = params.get("next") || "./index.html";

  const user = QA.getSessionUser();
  if (!user) {
    window.location.href = `./login.html?next=${encodeURIComponent("account.html" + window.location.search)}`;
    return;
  }

  document.getElementById("accountEmail").textContent = user.email;
  const input = document.getElementById("accountName");
  input.value = user.displayName;

  const back = document.getElementById("linkBack");
  back.href = nextRaw.startsWith("./") || nextRaw.startsWith("http") ? nextRaw : `./${nextRaw.replace(/^\.\//, "")}`;

  document.getElementById("formAccount").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      QA.updateUserDisplayName(user.email, fd.get("displayName"));
      window.location.href = back.href;
    } catch (err) {
      alert(err.message || String(err));
    }
  });
})();


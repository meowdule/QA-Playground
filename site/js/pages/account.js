export function initAccountPage(query) {
  const QA = window.QA;
  const params = query || QA.learnerAppSearchParams();
  const nextRaw = params.get("next") || "";
  const accountReturn =
    "index.html#/account" + (params.toString() ? `?${params.toString()}` : "");

  const user = QA.getSessionUser();
  if (!user) {
    window.location.href = QA.learnerHref.login(accountReturn);
    return;
  }

  document.getElementById("accountEmail").textContent = user.email;
  const input = document.getElementById("accountName");
  input.value = user.displayName;

  const back = document.getElementById("linkBack");
  back.href = nextRaw
    ? nextRaw.startsWith("./") || nextRaw.startsWith("http")
      ? nextRaw
      : `./${nextRaw.replace(/^\.\//, "")}`
    : QA.learnerHref.home();

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
}

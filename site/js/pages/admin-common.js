/**
 * 관리자 분리 페이지(admin-missions / admin-challenges / admin-reports) 공통 유틸.
 */
(function () {
  const QA = window.QA;

  function formatTs(ts) {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString("ko-KR", {
        dateStyle: "short",
        timeStyle: "medium"
      });
    } catch {
      return "—";
    }
  }

  function truncate(str, max) {
    const t = String(str || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max)}…`;
  }

  function tdText(text) {
    const td = document.createElement("td");
    td.textContent = text == null || text === "" ? "—" : String(text);
    return td;
  }

  function tdCode(text) {
    const td = document.createElement("td");
    const code = document.createElement("code");
    code.className = "admin-route-code";
    code.textContent = text;
    td.appendChild(code);
    return td;
  }

  function tdMessageCell(short, full) {
    const td = document.createElement("td");
    td.className = "admin-report-msg";
    if (full && String(full).length > short.length) {
      td.title = String(full);
    }
    td.textContent = short || "—";
    return td;
  }

  function gate(refs) {
    const ok = typeof QA.isAdminLoggedIn === "function" && QA.isAdminLoggedIn();
    if (refs.adminBlocked) refs.adminBlocked.hidden = ok;
    if (refs.adminWorkspace) refs.adminWorkspace.hidden = !ok;
    return ok;
  }

  window.QAAdminUtils = {
    formatTs,
    truncate,
    tdText,
    tdCode,
    tdMessageCell,
    gate
  };
})();

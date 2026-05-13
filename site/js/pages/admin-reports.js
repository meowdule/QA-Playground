(function () {
  const QA = window.QA;
  const U = window.QAAdminUtils;
  const refs = {
    adminBlocked: document.getElementById("adminBlocked"),
    adminWorkspace: document.getElementById("adminWorkspace"),
    reportTbody: document.getElementById("reportLogTbody"),
    reportCountEl: document.getElementById("reportLogCount")
  };

  function renderReports() {
    const list = typeof QA.loadReports === "function" ? QA.loadReports() : [];
    if (refs.reportCountEl) refs.reportCountEl.textContent = String(list.length);
    const tbody = refs.reportTbody;
    if (!tbody) return;
    tbody.textContent = "";

    if (!list.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.className = "muted";
      td.textContent = "저장된 제보가 없습니다.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for (const r of list) {
      const tr = document.createElement("tr");
      const msg = U.truncate(r.message, 160);
      const missionLabel = r.missionId ? `${r.missionId}${r.missionTitle ? ` · ${r.missionTitle}` : ""}` : "—";
      [
        U.tdText(U.formatTs(r.createdAt)),
        U.tdText(r.scope || "—"),
        U.tdText(missionLabel),
        U.tdText(r.category || "—"),
        U.tdText(r.userEmail || "—"),
        U.tdMessageCell(msg, r.message)
      ].forEach((td) => tr.appendChild(td));
      tbody.appendChild(tr);
    }
  }

  function boot() {
    QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: "./admin-reports.html" });
    if (!U.gate(refs)) return;
    renderReports();
  }

  boot();
})();

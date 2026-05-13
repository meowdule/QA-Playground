(function () {
  const QA = window.QA;
  const U = window.QAAdminUtils;
  const refs = {
    adminBlocked: document.getElementById("adminBlocked"),
    adminWorkspace: document.getElementById("adminWorkspace"),
    tbody: document.getElementById("challengeAdminTbody"),
    countEl: document.getElementById("challengeAdminCount")
  };

  function winSummary(ch) {
    const w = ch && Array.isArray(ch.winConditions) ? ch.winConditions : [];
    if (!w.length) return "—";
    return U.truncate(w.join(" · "), 80);
  }

  function renderTable() {
    const missions = Array.isArray(QA.missions) ? QA.missions : [];
    const list = missions.filter((m) => m && m.challenge && typeof m.challenge === "object");
    if (refs.countEl) refs.countEl.textContent = String(list.length);
    const tbody = refs.tbody;
    if (!tbody) return;
    tbody.textContent = "";

    if (!list.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 9;
      td.className = "muted";
      td.textContent = "challenge 블록이 있는 미션이 없습니다.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for (const m of list) {
      const ch = m.challenge;
      const tr = document.createElement("tr");

      const tdMid = document.createElement("td");
      const aId = document.createElement("a");
      aId.href = `./play.html?m=${encodeURIComponent(m.id)}`;
      aId.className = "admin-mono-link";
      aId.textContent = m.id;
      tdMid.appendChild(aId);

      const tdDetail = document.createElement("td");
      const aDet = document.createElement("a");
      aDet.href = `./challenge-detail.html?m=${encodeURIComponent(m.id)}`;
      aDet.className = "admin-mono-link";
      aDet.textContent = "상세 UI";
      tdDetail.appendChild(aDet);

      const tdPlay = document.createElement("td");
      const aPlay = document.createElement("a");
      aPlay.href = `./play.html?m=${encodeURIComponent(m.id)}`;
      aPlay.className = "btn-site-secondary";
      aPlay.style.display = "inline-block";
      aPlay.style.padding = "4px 10px";
      aPlay.style.fontSize = "0.78rem";
      aPlay.textContent = "플레이";
      tdPlay.appendChild(aPlay);

      [
        tdMid,
        U.tdText(m.title),
        U.tdText(ch.title || "—"),
        U.tdText(m.difficulty || "—"),
        U.tdText(ch.timeLimitSec != null ? String(ch.timeLimitSec) : "—"),
        U.tdText(ch.scoreMax != null ? String(ch.scoreMax) : "—"),
        U.tdText(winSummary(ch)),
        tdDetail,
        tdPlay
      ].forEach((td) => tr.appendChild(td));
      tbody.appendChild(tr);
    }
  }

  function boot() {
    QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: "./admin-challenges.html" });
    if (!U.gate(refs)) return;
    renderTable();
  }

  boot();
})();

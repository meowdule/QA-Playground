(function () {
  const QA = window.QA;
  const U = window.QAAdminUtils;
  const refs = {
    adminBlocked: document.getElementById("adminBlocked"),
    adminWorkspace: document.getElementById("adminWorkspace"),
    missionTbody: document.getElementById("missionCatalogTbody"),
    missionCountEl: document.getElementById("missionCatalogCount")
  };

  function renderMissionCatalog() {
    const missions = Array.isArray(QA.missions) ? QA.missions : [];
    if (refs.missionCountEl) refs.missionCountEl.textContent = String(missions.length);
    const tbody = refs.missionTbody;
    if (!tbody) return;
    tbody.textContent = "";

    for (const m of missions) {
      const sb = m.sandbox || {};
      const routes = Array.isArray(sb.allowedRoutes) ? sb.allowedRoutes.join(", ") : "—";
      const pre = Array.isArray(m.prerequisites) && m.prerequisites.length ? m.prerequisites.join(", ") : "—";
      const objN = Array.isArray(m.objectives) ? m.objectives.length : 0;
      const ch = m.challenge;
      let challengeCell;
      if (ch && typeof ch === "object") {
        const bits = [];
        if (ch.timeLimitSec != null) bits.push(`${ch.timeLimitSec}s`);
        if (ch.scoreMax != null) bits.push(`만점${ch.scoreMax}`);
        const summary = bits.length ? bits.join(" · ") : "정의됨";
        const td = document.createElement("td");
        const a = document.createElement("a");
        a.href = `./challenge-detail.html?m=${encodeURIComponent(m.id)}`;
        a.className = "admin-mono-link";
        a.textContent = summary;
        td.appendChild(a);
        challengeCell = td;
      } else {
        challengeCell = U.tdText("—");
      }
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      const a = document.createElement("a");
      a.href = `./play.html?m=${encodeURIComponent(m.id)}`;
      a.textContent = m.id;
      a.className = "admin-mono-link";
      tdId.appendChild(a);

      const cells = [
        tdId,
        U.tdText(m.title),
        U.tdText(m.type || "—"),
        U.tdText(m.difficulty || "—"),
        U.tdText(m.levelCode || "—"),
        U.tdText(m.chapter || "—"),
        U.tdText(sb.entryRoute || "—"),
        U.tdText(sb.headerProfile || "—"),
        U.tdCode(routes),
        U.tdText(pre),
        U.tdText(String(objN)),
        challengeCell,
        U.tdText(m.generatedMeta ? "생성" : "정적")
      ];
      cells.forEach((td) => tr.appendChild(td));
      tbody.appendChild(tr);
    }
  }

  function boot() {
    QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: "./admin-missions.html" });
    if (!U.gate(refs)) return;
    if (!Array.isArray(QA.missions) || !QA.missions.length) {
      const tbody = refs.missionTbody;
      if (tbody) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 13;
        td.className = "muted";
        td.textContent = "미션 카탈로그를 불러오지 못했습니다.";
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    } else {
      renderMissionCatalog();
    }
  }

  boot();
})();

(function () {
  const QA = window.QA;
  const missions = QA.missions;
  const isMissionUnlocked = QA.isMissionUnlocked;
  const getMissionById = QA.getMissionById;

  const params = new URLSearchParams(window.location.search);
  const missionId = params.get("m");
  const forceDetail = params.get("d") === "1";
  const hubGroup = missionId && !forceDetail ? QA.getFeatureGroupByHubId(missionId) : null;

  const playNext = missionId
    ? hubGroup
      ? `mission.html?m=${encodeURIComponent(missionId)}`
      : `play.html?m=${encodeURIComponent(missionId)}`
    : "index.html";

  QA.mountAuthNav(document.getElementById("authNavSlot"), {
    next: playNext,
    returnPath: `./mission.html${window.location.search}`
  });

  function shortName(id) {
    const m = missions.find((x) => x.id === id);
    return m ? m.title.split("·")[0].trim() : id;
  }

  function renderIntroHtml(text) {
    return String(text || "")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function initFeatureHub(group) {
    const hubRoot = document.getElementById("featureHubRoot");
    const detailRoot = document.getElementById("missionDetailRoot");
    if (hubRoot) hubRoot.hidden = false;
    if (detailRoot) detailRoot.hidden = true;

    document.getElementById("bcTitle").textContent = group.title;
    document.title = `${group.title} · QA Playground`;

    document.getElementById("hubTitle").textContent = group.title;
    document.getElementById("hubSummary").textContent = group.summary;
    document.getElementById("hubIntro").innerHTML = renderIntroHtml(group.intro || "");

    const key = QA.getProgressUserKey();
    const completed = key ? QA.getProgress(key).completedMissionIds : [];
    const listEl = document.getElementById("featureHubList");
    listEl.innerHTML = "";

    group.missionIds.forEach((mid) => {
      const m = getMissionById(mid);
      if (!m) return;

      const prereqOk = isMissionUnlocked(m, completed);
      const done = key && completed.includes(m.id);

      const li = document.createElement("li");
      li.className = `feature-hub-item ${!prereqOk ? "is-locked" : ""} ${done ? "is-done" : ""}`;

      const row = document.createElement("div");
      row.className = "feature-hub-item-row";

      const main = document.createElement("div");
      main.className = "feature-hub-item-main";

      const top = document.createElement("div");
      top.className = "feature-hub-item-top";
      top.innerHTML = `
        <span class="site-badge is-muted">${m.difficulty}</span>
        <span class="site-badge type-${m.type}">${m.type === "bug_hunt" ? "버그" : "성공"}</span>
        ${done ? '<span class="site-badge is-done">완료</span>' : ""}
        <span class="site-badge is-point">${m.points}점</span>
      `;

      const h3 = document.createElement("h3");
      h3.className = "feature-hub-item-title";
      h3.textContent = m.title;

      const detail = document.createElement("div");
      detail.className = "feature-hub-detail";
      detail.hidden = true;

      const desc = document.createElement("p");
      desc.className = "feature-hub-item-desc";
      desc.textContent = m.summary;

      detail.appendChild(desc);
      if (m.prerequisites?.length && !prereqOk) {
        const preq = document.createElement("p");
        preq.className = "feature-hub-preq";
        preq.textContent = `선행 필요 · ${m.prerequisites.map(shortName).join(", ")}`;
        detail.appendChild(preq);
      }

      main.appendChild(top);
      main.appendChild(h3);
      main.appendChild(detail);

      const actions = document.createElement("div");
      actions.className = "feature-hub-item-actions";

      const aDetail = document.createElement("button");
      aDetail.type = "button";
      aDetail.className = "btn-site-secondary feature-hub-desc-btn";
      aDetail.setAttribute("aria-expanded", "false");
      aDetail.textContent = "미션 설명";

      const aPlay = document.createElement("a");
      aPlay.className = `btn-site-primary feature-hub-play ${!prereqOk ? "is-disabled" : ""}`;
      aPlay.href = `./play.html?m=${encodeURIComponent(m.id)}`;
      aPlay.textContent = "수행하기";

      actions.appendChild(aDetail);
      actions.appendChild(aPlay);
      aDetail.addEventListener("click", () => {
        const open = detail.hidden;
        detail.hidden = !open;
        aDetail.setAttribute("aria-expanded", open ? "true" : "false");
        aDetail.textContent = open ? "설명 접기" : "미션 설명";
      });

      row.appendChild(main);
      row.appendChild(actions);
      li.appendChild(row);

      if (!prereqOk) {
        aPlay.addEventListener("click", (e) => {
          e.preventDefault();
          const blockId = QA.firstIncompletePrerequisiteId(m, completed);
          const bm = blockId ? getMissionById(blockId) : null;
          if (!bm) return;
          QA.openPrereqDialog({
            blockerId: blockId,
            blockerTitle: bm.title
          });
        });
      }

      listEl.appendChild(li);
    });
  }

  function initSingleMission(mission) {
    const hubRoot = document.getElementById("featureHubRoot");
    const detailRoot = document.getElementById("missionDetailRoot");
    if (hubRoot) hubRoot.hidden = true;
    if (detailRoot) detailRoot.hidden = false;

    const key = QA.getProgressUserKey();
    const completed = key ? QA.getProgress(key).completedMissionIds : [];
    const prereqOk = isMissionUnlocked(mission, completed);
    const done = key && completed.includes(mission.id);
    const user = QA.getSessionUser();

    const playNextSingle = `play.html?m=${encodeURIComponent(missionId)}`;

    document.getElementById("linkLoginGate").href = `./login.html?next=${encodeURIComponent(playNextSingle)}`;
    document.getElementById("linkSignupGate").href = `./signup.html?next=${encodeURIComponent(playNextSingle)}`;

    document.getElementById("bcTitle").textContent = mission.title;
    document.title = `${mission.title} · QA Playground`;

    document.getElementById("missionTitle").textContent = mission.title;
    document.getElementById("missionDifficulty").textContent = mission.difficulty;
    document.getElementById("missionPoints").textContent = `${mission.points}점`;

    const typeEl = document.getElementById("missionType");
    typeEl.textContent = mission.type === "bug_hunt" ? "버그 탐지" : "성공 시나리오";
    typeEl.className = `site-badge type-${mission.type}`;

    document.getElementById("missionSummary").textContent = mission.summary;
    document.getElementById("missionDescription").innerHTML = mission.description.replace(/\n/g, "<br>");

    const objUl = document.getElementById("objectivePreview");
    objUl.innerHTML = "";
    mission.objectives.forEach((o) => {
      const li = document.createElement("li");
      li.textContent = o.text;
      objUl.appendChild(li);
    });

    const preqNotice = document.getElementById("preqNotice");
    preqNotice.hidden = true;
    preqNotice.textContent = "";
    if (mission.prerequisites?.length && !prereqOk) {
      preqNotice.hidden = false;
      preqNotice.textContent = `선행 미션을 먼저 완료해 주세요: ${mission.prerequisites.map(shortName).join(", ")}`;
    }

    document.getElementById("doneBadge").hidden = !done;

    const btn = document.getElementById("btnStart");
    const gate = document.getElementById("loginGate");

    btn.href = `./play.html?m=${encodeURIComponent(missionId)}`;

    const parentGroup = QA.missionFeatureGroups.find((g) => g.missionIds.includes(mission.id));
    const parentNav = document.getElementById("detailParentNav");
    const backHubEl = document.getElementById("linkBackHub");
    if (parentNav && backHubEl) {
      if (parentGroup) {
        parentNav.hidden = false;
        backHubEl.href = `./mission.html?m=${encodeURIComponent(parentGroup.hubMissionId)}`;
        backHubEl.textContent = `← ${parentGroup.title} 목록으로`;
      } else {
        parentNav.hidden = true;
      }
    }

    gate.hidden = true;
    btn.classList.remove("is-disabled");

    if (!user) {
      gate.hidden = false;
      btn.classList.add("is-disabled");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `./login.html?next=${encodeURIComponent(playNextSingle)}`;
      });
      return;
    }

    if (!prereqOk) {
      btn.classList.add("is-disabled");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const blockId = QA.firstIncompletePrerequisiteId(mission, completed);
        const bm = blockId ? getMissionById(blockId) : null;
        if (!bm) return;
        QA.openPrereqDialog({
          blockerId: blockId,
          blockerTitle: bm.title
        });
      });
    }
  }

  function init() {
    if (!missionId) {
      window.location.href = "./index.html";
      return;
    }

    if (hubGroup) {
      initFeatureHub(hubGroup);
      return;
    }

    const mission = getMissionById(missionId);
    if (!mission) {
      window.location.href = "./index.html";
      return;
    }

    initSingleMission(mission);
  }

  init();
})();


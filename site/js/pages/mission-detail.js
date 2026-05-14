export function initMissionPage(queryParams) {
  const QA = window.QA;
  const missions = QA.missions;
  const isMissionUnlocked = QA.isMissionUnlocked;
  const getMissionById = QA.getMissionById;

  const params = queryParams || QA.learnerAppSearchParams();
  const missionId = params.get("m");
  const forceDetail = params.get("d") === "1";
  const hubGroup = missionId && !forceDetail ? QA.getFeatureGroupByHubId(missionId) : null;

  function playRelForMission(m) {
    if (!m) return null;
    if (m.chapter === "tc_authoring") return `play.html?m=${encodeURIComponent(m.id)}&from=tc_lab`;
    return `play.html?m=${encodeURIComponent(m.id)}`;
  }

  const playNext = !missionId
    ? "index.html"
    : hubGroup
      ? QA.learnerHref.mission(missionId)
      : playRelForMission(getMissionById(missionId)) || "index.html";

  const returnPath =
    missionId && forceDetail
      ? QA.learnerHref.mission(missionId, { detail: true })
      : missionId
        ? QA.learnerHref.mission(missionId)
        : QA.learnerHref.home();

  QA.mountAuthNav(document.getElementById("authNavSlot"), { next: playNext, returnPath });

  function shortName(id) {
    const m = missions.find((x) => x.id === id);
    return m ? m.title.split("·")[0].trim() : id;
  }

  function renderIntroHtml(text) {
    return String(text || "")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function missionTypeShortLabel(m) {
    if (m.type === "bug_hunt") return "버그";
    if (m.type === "defect_report") return "결함 제보";
    if (m.type === "tc_authoring") return "TC 작성";
    return "성공";
  }

  function missionTypeLongLabel(m) {
    if (m.type === "bug_hunt") return "버그 탐지";
    if (m.type === "defect_report") return "결함 제보";
    if (m.type === "tc_authoring") return "TC 작성";
    return "성공 시나리오";
  }

  function initFeatureHub(group) {
    const hubRoot = document.getElementById("featureHubRoot");
    const detailRoot = document.getElementById("missionDetailRoot");
    if (hubRoot) hubRoot.hidden = false;
    if (detailRoot) detailRoot.hidden = true;

    document.getElementById("bcTitle").textContent = group.title;
    document.title = `${group.title} · 테스피어-Tespier`;

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
        <span class="site-badge type-${m.type}">${missionTypeShortLabel(m)}</span>
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
      aDetail.textContent = "시나리오 설명";

      const aPlay = document.createElement("a");
      aPlay.className = `btn-site-primary feature-hub-play ${!prereqOk ? "is-disabled" : ""}`;
      aPlay.href = `./${playRelForMission(m)}`;
      aPlay.textContent = "수행하기";

      actions.appendChild(aDetail);
      actions.appendChild(aPlay);
      aDetail.addEventListener("click", () => {
        const open = detail.hidden;
        detail.hidden = !open;
        aDetail.setAttribute("aria-expanded", open ? "true" : "false");
        aDetail.textContent = open ? "설명 접기" : "시나리오 설명";
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

    const playNextSingle = playRelForMission(mission) || `play.html?m=${encodeURIComponent(missionId)}`;

    document.getElementById("linkLoginGate").href = QA.learnerHref.login(playNextSingle);
    document.getElementById("linkSignupGate").href = QA.learnerHref.signup(playNextSingle);

    document.getElementById("bcTitle").textContent = mission.title;
    document.title = `${mission.title} · 테스피어-Tespier`;

    document.getElementById("missionTitle").textContent = mission.title;
    document.getElementById("missionDifficulty").textContent = mission.difficulty;
    document.getElementById("missionPoints").textContent = `${mission.points}점`;

    const typeEl = document.getElementById("missionType");
    typeEl.textContent = missionTypeLongLabel(mission);
    typeEl.className = `site-badge type-${mission.type}`;

    document.getElementById("missionSummary").textContent = mission.summary;
    document.getElementById("missionDescription").innerHTML = mission.description.replace(/\n/g, "<br>");

    const follow = document.getElementById("bugDefectFollow");
    if (follow) {
      if (mission.type === "bug_hunt" && typeof QA.pairedDefectReportMissionId === "function") {
        const dr = QA.pairedDefectReportMissionId(mission.id);
        const dm = dr ? getMissionById(dr) : null;
        if (dr && dm) {
          follow.hidden = false;
          const det = QA.learnerHref.mission(dr, { detail: true });
          follow.innerHTML = `이 시나리오에서는 <strong>버그 재현·목표 달성</strong>만 합니다. 재현 내용을 정리한 <strong>결함 제보</strong>는 묶음에 이어지는 「${escapeHtml(
            dm.title
          )}」에서 작성합니다. 
          <a class="inline-link" href="${det}">결함 제보 미션 상세</a>
          ·
          <a class="inline-link" href="./play.html?m=${encodeURIComponent(dr)}">플레이로 이동</a>`;
        } else {
          follow.hidden = true;
        }
      } else {
        follow.hidden = true;
      }
    }

    const objUl = document.getElementById("objectivePreview");
    objUl.innerHTML = "";
    if (mission.type === "defect_report") {
      const li = document.createElement("li");
      li.textContent = "체크 목표 없음 · 플레이 화면에서 결함 제보 양식만 작성합니다.";
      objUl.appendChild(li);
    } else {
      const hiddenPolicy = mission.generatedMeta?.hiddenObjectivePolicy || "none";
      mission.objectives.forEach((o, index) => {
        const li = document.createElement("li");
        if (hiddenPolicy === "strict-hidden") {
          li.textContent = index === 0 ? "첫 목표는 플레이 화면에서 공개됩니다." : "??? (플레이 진행 중 공개)";
        } else if (hiddenPolicy === "partial-hidden") {
          li.textContent = index === 0 ? o.text : "??? (선행 목표 달성 시 공개)";
        } else {
          li.textContent = o.text;
        }
        objUl.appendChild(li);
      });
    }

    const preqNotice = document.getElementById("preqNotice");
    preqNotice.hidden = true;
    preqNotice.textContent = "";
    if (mission.prerequisites?.length && !prereqOk) {
      preqNotice.hidden = false;
      preqNotice.textContent = `선행 시나리오를 먼저 완료해 주세요: ${mission.prerequisites.map(shortName).join(", ")}`;
    }

    document.getElementById("doneBadge").hidden = !done;

    const btn = document.getElementById("btnStart");
    const gate = document.getElementById("loginGate");

    btn.href = `./${playRelForMission(mission) || `play.html?m=${encodeURIComponent(missionId)}`}`;

    const parentGroup = QA.missionFeatureGroups.find((g) => g.missionIds.includes(mission.id));
    const parentNav = document.getElementById("detailParentNav");
    const backHubEl = document.getElementById("linkBackHub");
    if (parentNav && backHubEl) {
      if (parentGroup) {
        parentNav.hidden = false;
        backHubEl.href = QA.learnerHref.mission(parentGroup.hubMissionId);
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
        window.location.href = QA.learnerHref.login(playNextSingle);
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
          blockerTitle: bm.title,
          onNo: () => {
            window.location.href = QA.learnerHref.mission(missionId);
          }
        });
      });
    }
  }

  if (!missionId) {
    window.location.href = QA.learnerHref.home();
    return;
  }

  if (hubGroup) {
    initFeatureHub(hubGroup);
    return;
  }

  const mission = getMissionById(missionId);
  if (!mission) {
    window.location.href = QA.learnerHref.home();
    return;
  }

  initSingleMission(mission);
}

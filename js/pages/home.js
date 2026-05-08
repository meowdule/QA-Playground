(function () {
  const QA = window.QA;
  const missions = QA.missions;
  const isMissionUnlocked = QA.isMissionUnlocked;
  const featureGroups = QA.missionFeatureGroups || [];

  const refs = {
    missionGrid: document.getElementById("missionGrid"),
    statCleared: document.getElementById("statCleared"),
    statPoints: document.getElementById("statPoints"),
    missionCount: document.getElementById("missionCount")
  };

  function pointsForCompleted(completedIds) {
    return missions.filter((m) => completedIds.includes(m.id)).reduce((s, m) => s + m.points, 0);
  }

  function renderStats() {
    const key = QA.getProgressUserKey();
    refs.missionCount.textContent = String(featureGroups.length);
    if (!key) {
      refs.statCleared.textContent = "로그인 시";
      refs.statPoints.textContent = "집계";
      return;
    }
    const prog = QA.getProgress(key);
    const cleared = prog.completedMissionIds.length;
    refs.statCleared.textContent = `${cleared} / ${missions.length}`;
    refs.statPoints.textContent = String(pointsForCompleted(prog.completedMissionIds));
  }

  function renderGrid() {
    if (!refs.missionGrid) return;
    const key = QA.getProgressUserKey();
    const completed = key ? QA.getProgress(key).completedMissionIds : [];

    refs.missionGrid.innerHTML = "";

    featureGroups.forEach((g) => {
      const card = document.createElement("a");
      const memberDone = g.missionIds.filter((id) => completed.includes(id)).length;
      const allDone = memberDone === g.missionIds.length;
      const anyLocked = g.missionIds.some((id) => {
        const m = missions.find((x) => x.id === id);
        return m && !isMissionUnlocked(m, completed);
      });

      card.className = `course-card course-card--feature ${allDone ? "is-done is-all-complete" : ""} ${anyLocked ? "is-locked" : ""}`;
      card.href = `./mission.html?m=${encodeURIComponent(g.hubMissionId)}`;

      const progressBadge =
        memberDone > 0 && !allDone
          ? `<span class="site-badge is-progress course-progress-badge">${memberDone}/${g.missionIds.length} 진행</span>`
          : "";

      const allDoneEmoji = allDone
        ? `<svg class="course-title-emoji" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" opacity="0.25"/>
            <path fill="currentColor" d="M12 2l2.85 6.1 6.65.57-5.04 4.38 1.52 6.52L12 16.9 5.02 19.57 6.54 13.05 1.5 8.67l6.65-.57L12 2z"/>
            <path d="M8.5 11.5l1.7 1.7 5.3-5.3" stroke="#0b1020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>
          </svg>`
        : "";

      card.innerHTML = `
      <h3 class="course-title">
        ${allDoneEmoji}
        <span class="course-title-text">${g.title}</span>
        <span class="site-badge is-muted course-scenario-count">${g.missionIds.length}개 시나리오</span>
        ${progressBadge}
      </h3>
      <p class="course-desc">${g.summary}</p>
      <div class="course-foot">
        <span class="course-more">시나리오 목록 →</span>
      </div>
    `;
      refs.missionGrid.appendChild(card);
    });
  }

  QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: "./index.html" });
  renderStats();
  renderGrid();
})();


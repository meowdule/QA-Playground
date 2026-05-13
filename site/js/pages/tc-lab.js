export function initTcLabPage() {
  const QA = window.QA;
  const missions = QA.missions;
  const isMissionUnlocked = QA.isMissionUnlocked;
  const allGroups = QA.missionFeatureGroups || [];
  const featureGroups = allGroups.filter((g) => {
    const hub = missions.find((x) => x.id === g.hubMissionId);
    return hub?.chapter === "tc_authoring";
  });

  const LEVEL_ORDER = ["beginner", "junior", "mid", "advanced"];
  const LEVEL_LABELS = {
    beginner: "입문",
    junior: "초급",
    mid: "중급",
    advanced: "상급"
  };

  const refs = {
    root: document.getElementById("tcLabCatalogRoot"),
    count: document.getElementById("tcLabCount"),
    statCleared: document.getElementById("statTcCleared"),
    statPoints: document.getElementById("statTcPoints")
  };

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function missionById(id) {
    return missions.find((x) => x.id === id) || null;
  }

  function levelCodesInGroup(g) {
    const set = new Set();
    g.missionIds.forEach((id) => {
      const lc = missionById(id)?.levelCode;
      if (lc) set.add(lc);
    });
    return LEVEL_ORDER.filter((k) => set.has(k));
  }

  function tcMissionIdSet() {
    const set = new Set();
    featureGroups.forEach((g) => g.missionIds.forEach((id) => set.add(id)));
    return set;
  }

  function pointsForTcCompleted(completedIds) {
    const tc = tcMissionIdSet();
    return missions.filter((m) => tc.has(m.id) && completedIds.includes(m.id)).reduce((s, m) => s + m.points, 0);
  }

  function renderStats() {
    const key = QA.getProgressUserKey();
    const tc = tcMissionIdSet();
    const total = tc.size;
    if (!refs.statCleared || !refs.statPoints) return;
    if (!key) {
      refs.statCleared.textContent = "로그인 시";
      refs.statPoints.textContent = "집계";
      return;
    }
    const prog = QA.getProgress(key);
    const cleared = prog.completedMissionIds.filter((id) => tc.has(id)).length;
    refs.statCleared.textContent = `${cleared} / ${total}`;
    refs.statPoints.textContent = String(pointsForTcCompleted(prog.completedMissionIds));
  }

  function renderGroupCard(g, completed) {
    const memberDone = g.missionIds.filter((id) => completed.includes(id)).length;
    const allDone = memberDone === g.missionIds.length;
    const anyLocked = g.missionIds.some((id) => {
      const m = missionById(id);
      return m && !isMissionUnlocked(m, completed);
    });

    const card = document.createElement("a");
    card.className = `course-card course-card--feature ${allDone ? "is-done is-all-complete" : ""} ${anyLocked ? "is-locked" : ""}`;
    card.href = QA.learnerHref.mission(g.hubMissionId);

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

    const levelKeys = levelCodesInGroup(g);
    const levelBadges = levelKeys
      .map((k) => `<span class="site-badge is-muted">${escapeHtml(LEVEL_LABELS[k] || k)}</span>`)
      .join("");

    card.innerHTML = `
      <h3 class="course-title">
        ${allDoneEmoji}
        <span class="course-title-text">${escapeHtml(g.title)}</span>
        <span class="site-badge is-muted course-scenario-count">${g.missionIds.length}개 과정</span>
        ${progressBadge}
      </h3>
      <p class="course-desc">${escapeHtml(g.summary)}</p>
      <div class="course-foot">
        <span class="course-card-meta">
          <span class="site-badge is-group">TC 작성 실습</span>
          ${levelBadges}
        </span>
        <span class="course-more">과정 목록 →</span>
      </div>
    `;
    return card;
  }

  function renderCatalog() {
    const root = refs.root;
    if (!root) return;
    root.textContent = "";
    if (refs.count) refs.count.textContent = String(featureGroups.length);

    if (!featureGroups.length) {
      const p = document.createElement("p");
      p.className = "catalog-empty-hint";
      p.textContent = "TC 작성 묶음이 없습니다.";
      root.appendChild(p);
      return;
    }

    const key = QA.getProgressUserKey();
    const completed = key ? QA.getProgress(key).completedMissionIds : [];
    const grid = document.createElement("div");
    grid.className = "course-grid";
    featureGroups.forEach((g) => grid.appendChild(renderGroupCard(g, completed)));
    root.appendChild(grid);
  }

  QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: QA.learnerHref.tcLab() });
  renderStats();
  renderCatalog();
}

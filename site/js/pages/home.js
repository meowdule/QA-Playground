export function initHomePage() {
  const QA = window.QA;
  const missions = QA.missions;
  const isMissionUnlocked = QA.isMissionUnlocked;
  const featureGroups = QA.missionFeatureGroups || [];

  const CHAPTER_ORDER = ["screen_test", "postman_test", "swagger_ai_test"];
  const CHAPTER_LABELS = {
    screen_test: "화면 테스트",
    postman_test: "포스트맨 테스트",
    swagger_ai_test: "Swagger·AI 기반 테스트"
  };

  const LEVEL_ORDER = ["beginner", "junior", "mid", "advanced"];
  const LEVEL_LABELS = {
    beginner: "입문",
    junior: "초급",
    mid: "중급",
    advanced: "상급"
  };

  const PROGRESS_OPTIONS = [
    ["all", "전체"],
    ["not_started", "수행 전"],
    ["in_progress", "수행 중"],
    ["completed", "수행 완료"]
  ];

  const refs = {
    missionCatalogRoot: document.getElementById("missionCatalogRoot"),
    statCleared: document.getElementById("statCleared"),
    statPoints: document.getElementById("statPoints"),
    missionCount: document.getElementById("missionCount"),
    chapterFilter: document.getElementById("catalogChapterFilter"),
    levelFilter: document.getElementById("catalogLevelFilter"),
    progressFilter: document.getElementById("catalogProgressFilter")
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

  function hubMission(g) {
    return missionById(g.hubMissionId);
  }

  function hubChapter(g) {
    return hubMission(g)?.chapter || "screen_test";
  }

  function groupMatchesLevel(g, levelFilter) {
    if (levelFilter === "all") return true;
    return g.missionIds.some((id) => missionById(id)?.levelCode === levelFilter);
  }

  function groupProgressState(g, completedIds) {
    const completed = completedIds || [];
    const total = g.missionIds.length;
    const done = g.missionIds.filter((id) => completed.includes(id)).length;
    if (total === 0) return "not_started";
    if (done === 0) return "not_started";
    if (done >= total) return "completed";
    return "in_progress";
  }

  function visibleGroups(chapterFilter, levelFilter, progressFilter, completedIds) {
    const progress = progressFilter || "all";
    return featureGroups.filter((g) => {
      if (hubChapter(g) === "tc_authoring") return false;
      if (!groupMatchesLevel(g, levelFilter)) return false;
      if (chapterFilter !== "all" && hubChapter(g) !== chapterFilter) return false;
      if (progress !== "all") {
        const st = groupProgressState(g, completedIds);
        if (st !== progress) return false;
      }
      return true;
    });
  }

  function levelCodesInGroup(g) {
    const set = new Set();
    g.missionIds.forEach((id) => {
      const lc = missionById(id)?.levelCode;
      if (lc) set.add(lc);
    });
    return LEVEL_ORDER.filter((k) => set.has(k));
  }

  function isScenarioCatalogMission(m) {
    return m.chapter !== "tc_authoring";
  }

  function pointsForCompleted(completedIds) {
    return missions
      .filter((m) => isScenarioCatalogMission(m) && completedIds.includes(m.id))
      .reduce((s, m) => s + m.points, 0);
  }

  function renderStats() {
    const key = QA.getProgressUserKey();
    if (!refs.statCleared || !refs.statPoints) return;
    if (!key) {
      refs.statCleared.textContent = "로그인 시";
      refs.statPoints.textContent = "집계";
      return;
    }
    const prog = QA.getProgress(key);
    const scenarioList = missions.filter(isScenarioCatalogMission);
    const cleared = prog.completedMissionIds.filter((id) => scenarioList.some((m) => m.id === id)).length;
    refs.statCleared.textContent = `${cleared} / ${scenarioList.length}`;
    refs.statPoints.textContent = String(pointsForCompleted(prog.completedMissionIds));
  }

  function populateFilters() {
    const chSel = refs.chapterFilter;
    const lvSel = refs.levelFilter;
    const prSel = refs.progressFilter;
    if (!chSel || !lvSel) return;

    const chaptersUsed = new Set(
      missions.filter(isScenarioCatalogMission).map((m) => m.chapter).filter(Boolean)
    );
    const levelsUsed = new Set(
      missions.filter(isScenarioCatalogMission).map((m) => m.levelCode).filter(Boolean)
    );

    const prevCh = chSel.value;
    const prevLv = lvSel.value;
    const prevPr = prSel?.value;

    chSel.innerHTML = "";
    const chAll = document.createElement("option");
    chAll.value = "all";
    chAll.textContent = "전체 챕터";
    chSel.appendChild(chAll);
    CHAPTER_ORDER.forEach((key) => {
      if (!chaptersUsed.has(key)) return;
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = CHAPTER_LABELS[key] || key;
      chSel.appendChild(opt);
    });

    lvSel.innerHTML = "";
    const lvAll = document.createElement("option");
    lvAll.value = "all";
    lvAll.textContent = "전체 난이도";
    lvSel.appendChild(lvAll);
    LEVEL_ORDER.forEach((key) => {
      if (!levelsUsed.has(key)) return;
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = LEVEL_LABELS[key] || key;
      lvSel.appendChild(opt);
    });

    if ([...chSel.options].some((o) => o.value === prevCh)) chSel.value = prevCh;
    if ([...lvSel.options].some((o) => o.value === prevLv)) lvSel.value = prevLv;

    if (prSel) {
      prSel.innerHTML = "";
      PROGRESS_OPTIONS.forEach(([val, label]) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = label;
        prSel.appendChild(opt);
      });
      if (prevPr && [...prSel.options].some((o) => o.value === prevPr)) prSel.value = prevPr;
    }
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

    const chKey = hubChapter(g);
    const chapterLabel = escapeHtml(CHAPTER_LABELS[chKey] || chKey);
    const levelKeys = levelCodesInGroup(g);
    const levelBadges = levelKeys
      .map((k) => `<span class="site-badge is-muted">${escapeHtml(LEVEL_LABELS[k] || k)}</span>`)
      .join("");

    card.innerHTML = `
      <h3 class="course-title">
        ${allDoneEmoji}
        <span class="course-title-text">${escapeHtml(g.title)}</span>
        <span class="site-badge is-muted course-scenario-count">${g.missionIds.length}개 시나리오</span>
        ${progressBadge}
      </h3>
      <p class="course-desc">${escapeHtml(g.summary)}</p>
      <div class="course-foot">
        <span class="course-card-meta">
          <span class="site-badge is-group">${chapterLabel}</span>
          ${levelBadges}
        </span>
        <span class="course-more">시나리오 목록 →</span>
      </div>
    `;
    return card;
  }

  function renderCatalog() {
    const root = refs.missionCatalogRoot;
    if (!root) return;

    const chapterFilter = refs.chapterFilter?.value || "all";
    const levelFilter = refs.levelFilter?.value || "all";
    const progressFilter = refs.progressFilter?.value || "all";
    const key = QA.getProgressUserKey();
    const completed = key ? QA.getProgress(key).completedMissionIds : [];
    const groups = visibleGroups(chapterFilter, levelFilter, progressFilter, completed);

    if (refs.missionCount) refs.missionCount.textContent = String(groups.length);

    root.textContent = "";

    if (!groups.length) {
      const p = document.createElement("p");
      p.className = "catalog-empty-hint";
      p.textContent = "조건에 맞는 기능 묶음이 없습니다. 필터를 바꿔 보세요.";
      root.appendChild(p);
      return;
    }

    if (chapterFilter !== "all") {
      const chLabel = CHAPTER_LABELS[chapterFilter] || chapterFilter;
      const sec = document.createElement("section");
      sec.className = "catalog-chapter-block";
      sec.setAttribute("aria-labelledby", "catalog-section-title");
      const h3 = document.createElement("h3");
      h3.className = "catalog-chapter-title";
      h3.id = "catalog-section-title";
      h3.textContent = chLabel;
      const grid = document.createElement("div");
      grid.className = "course-grid";
      groups.forEach((g) => grid.appendChild(renderGroupCard(g, completed)));
      sec.appendChild(h3);
      sec.appendChild(grid);
      root.appendChild(sec);
      return;
    }

    const byChapter = {};
    groups.forEach((g) => {
      const ch = hubChapter(g);
      if (!byChapter[ch]) byChapter[ch] = [];
      byChapter[ch].push(g);
    });

    const seen = new Set(CHAPTER_ORDER);
    const extras = Object.keys(byChapter)
      .filter((k) => !seen.has(k))
      .sort();
    const chapterKeysOrdered = [...CHAPTER_ORDER, ...extras];

    chapterKeysOrdered.forEach((ch) => {
      const list = byChapter[ch];
      if (!list?.length) return;
      const sec = document.createElement("section");
      sec.className = "catalog-chapter-block";
      const h3 = document.createElement("h3");
      h3.className = "catalog-chapter-title";
      h3.textContent = CHAPTER_LABELS[ch] || ch;
      const grid = document.createElement("div");
      grid.className = "course-grid";
      list.forEach((g) => grid.appendChild(renderGroupCard(g, completed)));
      sec.appendChild(h3);
      sec.appendChild(grid);
      root.appendChild(sec);
    });
  }

  function wireFilters() {
    const rerender = () => renderCatalog();
    refs.chapterFilter?.addEventListener("change", rerender);
    refs.levelFilter?.addEventListener("change", rerender);
    refs.progressFilter?.addEventListener("change", rerender);
  }

  const appQ = QA.learnerAppSearchParams();
  QA.mountAuthNav(document.getElementById("authNavSlot"), { returnPath: QA.learnerHref.home() });
  populateFilters();
  const chapterPreset = appQ.get("chapter");
  if (chapterPreset === "tc_authoring") {
    window.location.replace(QA.learnerHref.tcLab());
    return;
  }
  if (chapterPreset && refs.chapterFilter && [...refs.chapterFilter.options].some((o) => o.value === chapterPreset)) {
    refs.chapterFilter.value = chapterPreset;
  }
  const progressPreset = appQ.get("progress");
  if (
    progressPreset &&
    refs.progressFilter &&
    [...refs.progressFilter.options].some((o) => o.value === progressPreset)
  ) {
    refs.progressFilter.value = progressPreset;
  }
  wireFilters();
  renderStats();
  renderCatalog();
}

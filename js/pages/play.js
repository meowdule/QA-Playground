(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const missionId = params.get("m");

  const refs = {
    title: document.getElementById("missionTitle"),
    type: document.getElementById("missionType"),
    difficulty: document.getElementById("missionDifficulty"),
    summary: document.getElementById("missionSummary"),
    description: document.getElementById("missionDescription"),
    objectives: document.getElementById("objectiveList"),
    activity: document.getElementById("activityLog"),
    sandbox: document.getElementById("sandboxMount"),
    reportForm: document.getElementById("reportForm"),
    reportHint: document.getElementById("reportHint"),
    reportFab: document.getElementById("reportFab"),
    reportWidget: document.getElementById("reportWidget"),
    reportBackdrop: document.getElementById("reportBackdrop"),
    reportWidgetClose: document.getElementById("reportWidgetClose"),
    completeMissionBtn: document.getElementById("completeMissionBtn"),
    activityClearBtn: document.getElementById("activityClearBtn"),
    backLink: document.getElementById("backHome"),
    clearToast: document.getElementById("reportToast")
  };

  let sandbox = null;
  const userKey = QA.getProgressUserKey();
  let mission = null;
  let progress = null;
  let reportSubmittedThisSession = false;
  let reportPromptedAfterComplete = false;

  function redirectToLogin() {
    if (!missionId) {
      window.location.href = "./index.html";
      return;
    }
    const next = `play.html?m=${encodeURIComponent(missionId)}`;
    window.location.href = `./login.html?next=${encodeURIComponent(next)}`;
  }

  function isBugMission() {
    return mission?.type === "bug_hunt";
  }

  function allObjectivesMet() {
    if (!mission || !sandbox) return false;
    const snap = sandbox.getSnapshot();
    return mission.objectives.every((obj) => QA.evaluateCheck(obj.checkId, snap));
  }

  function logActivity(text) {
    const ul = refs.activity;
    if (!ul) return;
    const t = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const li = document.createElement("li");
    li.textContent = `${t} — ${text}`;
    ul.insertBefore(li, ul.firstChild);
    while (ul.children.length > 24) ul.removeChild(ul.lastChild);
  }

  function updateCompleteButton() {
    const btn = refs.completeMissionBtn;
    if (!btn) return;
    const ok = allObjectivesMet();
    const needsReport = isBugMission() && ok && !reportSubmittedThisSession;
    btn.disabled = !ok || needsReport;
    btn.textContent = needsReport ? "오류 제보 작성 후 미션 완료" : "미션 완료 · 목록으로";
  }

  function renderObjectives() {
    if (!mission || !sandbox) return;
    const snap = sandbox.getSnapshot();
    refs.objectives.innerHTML = "";
    mission.objectives.forEach((obj) => {
      const ok = QA.evaluateCheck(obj.checkId, snap);
      const li = document.createElement("li");
      li.className = ok ? "done" : "";
      li.innerHTML = `<span class="mark">${ok ? "✓" : ""}</span><span>${obj.text}</span>`;
      refs.objectives.appendChild(li);
    });
    if (isBugMission() && allObjectivesMet() && !reportSubmittedThisSession && !reportPromptedAfterComplete) {
      reportPromptedAfterComplete = true;
      logActivity("오류 재현 완료: 제보 작성 후 미션 완료 버튼이 활성화됩니다.");
      setReportOpen(true);
    }
    updateCompleteButton();
  }

  function completeMissionAndLeave() {
    if (!mission || !sandbox || !allObjectivesMet()) return;
    if (isBugMission() && !reportSubmittedThisSession) {
      alert("버그 미션은 오류 제보를 작성한 뒤 완료할 수 있습니다.");
      setReportOpen(true);
      return;
    }
    const prog = QA.getProgress(userKey);
    if (!prog.completedMissionIds.includes(mission.id)) {
      QA.markMissionComplete(userKey, mission.id);
      if (mission.id === "m_signup" && sandbox.state.lastRegisteredEmail) {
        QA.saveSignupIdentity(userKey, sandbox.state.lastRegisteredEmail, sandbox.state.lastRegisteredName || "");
      }
      logActivity(`미션 클리어! +${mission.points}점`);
    }
    window.location.href = "./index.html";
  }

  function onSandboxUpdate(message) {
    logActivity(message);
    renderObjectives();
  }

  function mountPlayAuthNav() {
    const playAuth = document.getElementById("playAuthNav");
    if (!playAuth) return;
    QA.mountAuthNav(playAuth, {
      returnPath: `./play.html?m=${encodeURIComponent(missionId)}`
    });
  }

  function ensureMissionUnlocked() {
    const completed = progress.completedMissionIds;
    if (QA.isMissionUnlocked(mission, completed)) return true;

    const blockId = QA.firstIncompletePrerequisiteId(mission, completed);
    const bm = blockId ? QA.getMissionById(blockId) : null;
    if (bm) {
      QA.openPrereqDialog({
        blockerId: blockId,
        blockerTitle: bm.title,
        onNo: () => {
          window.location.href = `./mission.html?m=${encodeURIComponent(missionId)}`;
        }
      });
    } else {
      window.location.href = `./mission.html?m=${encodeURIComponent(missionId)}`;
    }
    return false;
  }

  function setMissionContent() {
    refs.title.textContent = mission.title;
    refs.difficulty.textContent = mission.difficulty;
    refs.type.textContent = isBugMission() ? "버그 탐지" : "성공 시나리오";
    refs.type.className = `pill type-${mission.type}`;
    refs.summary.textContent = mission.summary;
    refs.description.innerHTML = mission.description.replace(/\n/g, "<br>");
  }

  function setReportHint() {
    if (!refs.reportHint) return;
    refs.reportHint.textContent = isBugMission()
      ? "버그 미션: 재현 순서·기대 결과·실제 결과를 제보에 남겨야 미션 완료가 가능합니다."
      : "플로우가 이상하면 자유롭게 제보해 주세요. (이 PC 브라우저에만 저장)";
  }

  function setupReportWidget() {
    if (refs.reportFab) {
      refs.reportFab.addEventListener("click", () => {
        setReportOpen(!!refs.reportWidget?.hidden);
      });
    }
    if (refs.reportWidgetClose) {
      refs.reportWidgetClose.addEventListener("click", () => setReportOpen(false));
    }
    if (refs.reportBackdrop) {
      refs.reportBackdrop.addEventListener("click", () => setReportOpen(false));
    }
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (refs.reportWidget && !refs.reportWidget.hidden) {
        setReportOpen(false);
      }
    });
  }

  function setupActivityReset() {
    if (!refs.activityClearBtn || !refs.activity) return;
    refs.activityClearBtn.addEventListener("click", () => {
      refs.activity.innerHTML = "";
      reportSubmittedThisSession = false;
      reportPromptedAfterComplete = false;
      sandbox.resetToInitial(true);
      renderObjectives();
      setReportOpen(false);
    });
  }

  function setupReportSubmit() {
    if (!refs.reportForm) return;
    refs.reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(refs.reportForm);
      QA.addReport({
        userEmail: userKey,
        missionId: mission.id,
        missionTitle: mission.title,
        category: fd.get("category"),
        message: String(fd.get("message") || "").trim()
      });
      refs.reportForm.reset();
      reportSubmittedThisSession = true;
      updateCompleteButton();
      if (refs.clearToast) {
        refs.clearToast.hidden = false;
        setTimeout(() => {
          refs.clearToast.hidden = true;
        }, 2400);
      }
    });
  }

  function setReportOpen(open) {
    const w = refs.reportWidget;
    const b = refs.reportBackdrop;
    const fab = refs.reportFab;
    if (!w || !b) return;
    w.hidden = !open;
    b.hidden = !open;
    b.setAttribute("aria-hidden", open ? "false" : "true");
    if (fab) {
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      fab.classList.toggle("is-open", open);
    }
    if (open) {
      refs.reportWidgetClose?.focus();
    } else {
      fab?.focus();
    }
  }

  function init() {
    if (!userKey) {
      redirectToLogin();
      return;
    }
    if (!missionId) {
      window.location.href = "./index.html";
      return;
    }
    mission = QA.getMissionById(missionId);
    if (!mission) {
      alert("알 수 없는 미션입니다.");
      window.location.href = "./index.html";
      return;
    }

    progress = QA.getProgress(userKey);
    if (!ensureMissionUnlocked()) {
      return;
    }

    refs.backLink.href = "./index.html";
    mountPlayAuthNav();
    setMissionContent();
    setReportHint();

    if (refs.completeMissionBtn) {
      refs.completeMissionBtn.addEventListener("click", () => completeMissionAndLeave());
    }

    setupReportWidget();

    sandbox = new QA.SandboxApp(refs.sandbox, mission, progress, onSandboxUpdate);
    renderObjectives();
    setupActivityReset();
    setupReportSubmit();
  }

  init();
})();


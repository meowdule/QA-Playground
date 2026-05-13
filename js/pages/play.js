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
    externalSiteFrame: document.getElementById("externalSiteFrame"),
    validatorStatus: document.getElementById("validatorStatus"),
    runValidationBtn: document.getElementById("runValidationBtn"),
    reportForm: document.getElementById("reportForm"),
    reportHint: document.getElementById("reportHint"),
    guideReportOpenBtn: document.getElementById("guideReportOpenBtn"),
    inquiryFab: document.getElementById("inquiryFab"),
    inquiryWidget: document.getElementById("inquiryWidget"),
    inquiryBackdrop: document.getElementById("inquiryBackdrop"),
    inquiryForm: document.getElementById("inquiryForm"),
    inquiryMessage: document.getElementById("inquiryMessage"),
    inquiryWidgetClose: document.getElementById("inquiryWidgetClose"),
    inquiryToast: document.getElementById("inquiryToast"),
    reportMessage: document.getElementById("reportMessage"),
    reportCategory: document.getElementById("reportCategory"),
    reportWidget: document.getElementById("reportWidget"),
    reportBackdrop: document.getElementById("reportBackdrop"),
    reportWidgetClose: document.getElementById("reportWidgetClose"),
    completeMissionBtn: document.getElementById("completeMissionBtn"),
    bugTargetLaunchBtn: document.getElementById("bugTargetLaunchBtn"),
    bugTargetModal: document.getElementById("bugTargetModal"),
    bugTargetModalClose: document.getElementById("bugTargetModalClose"),
    bugTargetForm: document.getElementById("bugTargetForm"),
    bugTargetMessage: document.getElementById("bugTargetMessage"),
    bugTargetToast: document.getElementById("bugTargetToast"),
    activityClearBtn: document.getElementById("activityClearBtn"),
    progressText: document.getElementById("progressText"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    currentGuide: document.getElementById("currentGuide"),
    difficultyHint: document.getElementById("difficultyHint"),
    backLink: document.getElementById("backHome"),
    clearToast: document.getElementById("reportToast"),
    sandboxInteractiveHost: document.getElementById("sandboxInteractiveHost"),
    sandboxToolbarLabel: document.getElementById("sandboxToolbarLabel")
  };

  const userKey = QA.getProgressUserKey();
  let mission = null;
  let progress = null;
  /** 연습 데모 대상 버그 제보 모달에서 저장 완료 시에만 true (미션 완료 조건) */
  let targetBugReportSaved = false;
  let loggedBugTargetHint = false;
  let checkState = {};
  let validationTimer = null;
  let lastValidationSignature = "";
  let skippedValidatorContextLogged = false;
  let sandboxApp = null;
  const VALIDATOR_BASES = ["http://127.0.0.1:4173", "http://localhost:4173"];
  const DEFAULT_REPORT_PLACEHOLDER = "재현 단계, 기대 결과, 실제 결과 등";
  const BUG_REPORT_PLACEHOLDER = `[재현 단계]
1. (예: 연습 데모에서 어떤 메뉴/버튼을 눌렀는지 순서대로)
2. 

[기대 결과]
(예: 빈 필드면 제출이 거절되어야 함)

[실제 결과]
(예: 빈 필드로도 제출 성공 메시지가 뜸)

[환경] (선택)
브라우저 / OS:`;

  function useInteractiveSandbox() {
    return Boolean(mission?.sandbox);
  }

  function tearDownInteractiveSandbox() {
    sandboxApp = null;
    if (refs.sandboxInteractiveHost) {
      refs.sandboxInteractiveHost.innerHTML = "";
      refs.sandboxInteractiveHost.hidden = true;
    }
    if (refs.externalSiteFrame) {
      refs.externalSiteFrame.hidden = false;
      refs.externalSiteFrame.removeAttribute("aria-hidden");
    }
  }

  function applyChecksFromSandbox() {
    if (!sandboxApp || !mission) return;
    const snap = sandboxApp.getSnapshot();
    const next = {};
    mission.objectives.forEach((o) => {
      next[o.checkId] = QA.evaluateCheck(o.checkId, snap);
    });
    checkState = next;
    renderObjectives();
  }

  function mountInteractiveSandbox() {
    if (!refs.sandboxInteractiveHost || typeof QA.SandboxApp !== "function") {
      logActivity("연습 화면(SandboxApp)을 불러오지 못했습니다. sandbox.js 스크립트를 확인하세요.");
      return;
    }
    tearDownInteractiveSandbox();
    refs.sandboxInteractiveHost.hidden = false;
    if (refs.externalSiteFrame) {
      refs.externalSiteFrame.hidden = true;
      refs.externalSiteFrame.setAttribute("aria-hidden", "true");
    }
    const profilePayload = {
      lastSignupEmail: progress.lastSignupEmail,
      lastSignupName: progress.lastSignupName
    };
    sandboxApp = new QA.SandboxApp(refs.sandboxInteractiveHost, mission, profilePayload, (msg) => {
      logActivity(msg);
      applyChecksFromSandbox();
    });
    applyChecksFromSandbox();
  }

  /** GitHub Pages 등 HTTPS 공개 호스트에서는 http://127.0.0.1 로의 fetch가 혼합 콘텐츠로 차단됨 */
  function localValidatorBlockedOnThisHost() {
    if (window.location.protocol !== "https:") return false;
    const h = window.location.hostname;
    return h !== "localhost" && h !== "127.0.0.1";
  }

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
    if (!mission) return false;
    return mission.objectives.every((obj) => checkState[obj.checkId] === true);
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
    const needsReport = isBugMission() && ok && !targetBugReportSaved;
    btn.disabled = !ok || needsReport;
    btn.textContent = needsReport ? "버그 제보 저장 후 미션 완료" : "미션 완료 · 목록으로";
    if (refs.bugTargetLaunchBtn) {
      refs.bugTargetLaunchBtn.hidden = !(isBugMission() && ok && !targetBugReportSaved);
    }
  }

  function renderObjectives() {
    if (!mission) return;
    const hiddenPolicy = mission.generatedMeta?.hiddenObjectivePolicy || "none";

    function isObjectiveRevealed(index, objectiveDone) {
      if (hiddenPolicy === "none") return true;
      if (objectiveDone) return true;
      if (index === 0) {
        return hiddenPolicy === "partial-hidden";
      }
      const prevObj = mission.objectives[index - 1];
      if (!prevObj) return true;
      return checkState[prevObj.checkId] === true;
    }

    refs.objectives.innerHTML = "";
    let doneCount = 0;
    let firstPendingText = "";
    mission.objectives.forEach((obj, index) => {
      const ok = checkState[obj.checkId] === true;
      if (ok) doneCount += 1;
      const revealed = isObjectiveRevealed(index, ok);
      const li = document.createElement("li");
      li.className = ok ? "done" : "";
      const text = revealed ? obj.text : "??? (행동을 진행하면 목표가 공개됩니다)";
      if (!ok && !firstPendingText) firstPendingText = text;
      li.innerHTML = `<span class="mark">${ok ? "✓" : ""}</span><span>${text}</span>`;
      refs.objectives.appendChild(li);
    });
    updateLearningPanel(doneCount, mission.objectives.length, firstPendingText);
    if (isBugMission() && allObjectivesMet() && !targetBugReportSaved && !loggedBugTargetHint) {
      loggedBugTargetHint = true;
      logActivity(
        "테스트(연습 데모)에서 버그를 재현했습니다. 화면 중앙 「테스트 대상 버그 제보」를 눌러 별도 창에 재현·기대·실제 결과를 적고 저장하세요. (우하단 「제보 도우미」는 튜토리얼 진행 제보용, ? 는 이 사이트 문의입니다.)"
      );
    }
    updateCompleteButton();
  }

  function completeMissionAndLeave() {
    if (!mission || !allObjectivesMet()) return;
    if (isBugMission() && !targetBugReportSaved) {
      alert(
        "버그 미션은 먼저 화면 중앙 「테스트 대상 버그 제보」를 열어 작성·저장해야 합니다. 튜토리얼 쪽 의견은 「제보 도우미」, 이 사이트 문의는 ? 버튼을 사용하세요."
      );
      return;
    }
    const prog = QA.getProgress(userKey);
    if (!prog.completedMissionIds.includes(mission.id)) {
      QA.markMissionComplete(userKey, mission.id);
      logActivity(`미션 클리어! +${mission.points}점`);
    }
    window.location.href = "./index.html";
  }

  async function runAutoValidation() {
    if (!mission) return;
    if (useInteractiveSandbox()) return;
    if (localValidatorBlockedOnThisHost()) {
      if (refs.validatorStatus) {
        refs.validatorStatus.textContent = "자동 검증 불가(HTTPS 배포)";
      }
      if (!skippedValidatorContextLogged) {
        skippedValidatorContextLogged = true;
        logActivity(
          "이 튜토리얼이 HTTPS(예: GitHub Pages)로 열려 있어, 브라우저가 로컬 검증 서버(http://127.0.0.1)로의 요청을 막습니다. 같은 PC에서 튜토리얼을 http:// 로 열고(`npx serve .` 등) `npm run validator:start`를 실행해야 활동 로그에 검증 결과가 붙습니다."
        );
      }
      renderObjectives();
      return;
    }
    const payload = {
      missionId: mission.id,
      targetUrl: "https://meowdule.github.io/SEO-TESTING-HTML/",
      checkIds: mission.objectives.map((o) => o.checkId)
    };
    try {
      if (refs.validatorStatus) refs.validatorStatus.textContent = "검증 중...";
      let res = null;
      let lastFetchErr = null;
      for (const base of VALIDATOR_BASES) {
        try {
          res = await fetch(`${base}/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          lastFetchErr = null;
          break;
        } catch (e) {
          lastFetchErr = e;
          res = null;
        }
      }
      if (!res) throw lastFetchErr || new Error("fetch failed");
      if (!res.ok) throw new Error(`validator http ${res.status}`);
      const data = await res.json();
      checkState = data.checks || {};
      if (refs.validatorStatus) refs.validatorStatus.textContent = "검증 서버 연결됨";
      const sig = JSON.stringify(checkState);
      if (sig !== lastValidationSignature) {
        lastValidationSignature = sig;
        (data.logs || []).forEach((line) => logActivity(`[검증] ${line}`));
        logActivity("자동 검증 상태가 갱신되었습니다.");
      }
      renderObjectives();
    } catch (err) {
      if (refs.validatorStatus) refs.validatorStatus.textContent = "검증 서버 오프라인";
      if (!lastValidationSignature) {
        logActivity(
          "자동 검증 서버에 연결하지 못했습니다. `npm run validator:start`를 실행하고, `file://` 대신 `npx serve .` 등으로 http:// 로 열면 연결이 잘 됩니다."
        );
        logActivity(`검증 오류: ${err.message || String(err)}`);
      }
      renderObjectives();
    }
  }

  function setupValidationControls() {
    if (useInteractiveSandbox()) {
      if (validationTimer) clearInterval(validationTimer);
      validationTimer = null;
      if (refs.runValidationBtn) refs.runValidationBtn.hidden = true;
      if (refs.validatorStatus) refs.validatorStatus.textContent = "동작으로 목표 갱신";
      return;
    }
    if (refs.runValidationBtn) {
      refs.runValidationBtn.hidden = false;
      refs.runValidationBtn.addEventListener("click", () => runAutoValidation());
    }
    if (validationTimer) clearInterval(validationTimer);
    if (!localValidatorBlockedOnThisHost()) {
      validationTimer = setInterval(() => {
        runAutoValidation();
      }, 6000);
    }
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
      ? "「제보 도우미」는 튜토리얼·진행에 대한 제보·의견입니다. 연습 데모(테스트 대상)의 버그는 목표 완료 후 화면 중앙 버튼으로 뜨는 별도 창에서 제출하세요. 이 사이트(튜토리얼) 자체 문의는 우하단 ? 를 눌러 주세요."
      : "플로우가 이상하면 자유롭게 제보해 주세요. (이 PC 브라우저에만 저장)";
  }

  function setReportChrome() {
    const submitBtn = refs.reportForm?.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "로컬에 저장";
    }
  }

  function setupGuideReportWidget() {
    if (refs.guideReportOpenBtn) {
      refs.guideReportOpenBtn.addEventListener("click", () => {
        setGuideReportOpen(!!refs.reportWidget?.hidden);
      });
    }
    if (refs.reportWidgetClose) {
      refs.reportWidgetClose.addEventListener("click", () => setGuideReportOpen(false));
    }
    if (refs.reportBackdrop) {
      refs.reportBackdrop.addEventListener("click", () => setGuideReportOpen(false));
    }
  }

  function setupInquiryWidget() {
    if (refs.inquiryFab) {
      refs.inquiryFab.addEventListener("click", () => {
        setInquiryOpen(!!refs.inquiryWidget?.hidden);
      });
    }
    if (refs.inquiryWidgetClose) {
      refs.inquiryWidgetClose.addEventListener("click", () => setInquiryOpen(false));
    }
    if (refs.inquiryBackdrop) {
      refs.inquiryBackdrop.addEventListener("click", () => setInquiryOpen(false));
    }
  }

  function setupModalEscape() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (refs.bugTargetModal && !refs.bugTargetModal.hidden) {
        closeBugTargetModal();
        return;
      }
      if (refs.inquiryWidget && !refs.inquiryWidget.hidden) {
        setInquiryOpen(false);
        return;
      }
      if (refs.reportWidget && !refs.reportWidget.hidden) {
        setGuideReportOpen(false);
      }
    });
  }

  function setupActivityReset() {
    if (!refs.activityClearBtn || !refs.activity) return;
    refs.activityClearBtn.addEventListener("click", () => {
      resetLearningSession("로그 초기화 후 처음부터 다시 시작했습니다.");
    });
  }

  function resetLearningSession(logMessage) {
    refs.activity.innerHTML = "";
    targetBugReportSaved = false;
    loggedBugTargetHint = false;
    checkState = {};
    setGuideReportOpen(false);
    setInquiryOpen(false);
    if (useInteractiveSandbox()) {
      if (sandboxApp) sandboxApp.resetToInitial(true);
      applyChecksFromSandbox();
    } else {
      renderObjectives();
      if (refs.externalSiteFrame) {
        refs.externalSiteFrame.src = "https://meowdule.github.io/SEO-TESTING-HTML/";
      }
      runAutoValidation();
    }
    if (logMessage) {
      logActivity(logMessage);
    }
  }

  function updateLearningPanel(doneCount, totalCount, firstPendingText) {
    if (!refs.progressText || !refs.progressCount || !refs.progressFill || !refs.currentGuide || !refs.difficultyHint) return;
    const total = Math.max(totalCount, 1);
    const ratio = Math.min(100, Math.round((doneCount / total) * 100));
    refs.progressText.textContent = `진행률 ${ratio}%`;
    refs.progressCount.textContent = `${doneCount} / ${totalCount}`;
    refs.progressFill.style.width = `${ratio}%`;

    if (doneCount >= totalCount) {
      if (isBugMission() && !targetBugReportSaved) {
        refs.currentGuide.textContent =
          "목표를 모두 달성했습니다. 화면 중앙 「테스트 대상 버그 제보」를 눌러 저장한 뒤 미션 완료를 눌러 주세요.";
      } else {
        refs.currentGuide.textContent = "모든 목표를 달성했습니다. 미션 완료 버튼을 눌러 제출하세요.";
      }
    } else {
      refs.currentGuide.textContent = firstPendingText
        ? `현재 가이드: ${firstPendingText}`
        : "현재 가이드: 화면 동작을 진행하면 다음 목표가 공개됩니다.";
    }

    const d = String(mission?.difficulty || "");
    if (d.includes("입문")) {
      refs.difficultyHint.textContent = "힌트: 막히면 활동 로그의 「로그 초기화」로 처음부터 다시 시도하고, CTA/상단 메뉴부터 순서대로 확인하세요.";
    } else if (d.includes("중급")) {
      refs.difficultyHint.textContent = "힌트(중급): 이전 목표를 달성하면 다음 목표가 드러납니다. 로그를 보며 이동 경로를 복기하세요.";
    } else {
      refs.difficultyHint.textContent = "힌트(상급): 목표는 점진적으로 공개됩니다. 최소 힌트만 제공되며, 행동 로그를 기반으로 추론하세요.";
    }
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
        message: String(fd.get("message") || "").trim(),
        scope: "tutorial_feedback"
      });
      refs.reportForm.reset();
      if (refs.clearToast) {
        refs.clearToast.hidden = false;
        setTimeout(() => {
          refs.clearToast.hidden = true;
        }, 2400);
      }
      setGuideReportOpen(false);
      logActivity("제보·의견을 저장했습니다. (미션 완료 조건과는 별도)");
    });
  }

  function setupInquirySubmit() {
    if (!refs.inquiryForm) return;
    refs.inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = String(refs.inquiryMessage?.value || "").trim();
      if (!msg) return;
      QA.addReport({
        userEmail: userKey,
        missionId: mission.id,
        missionTitle: mission.title,
        category: "feedback",
        message: msg,
        scope: "site_inquiry"
      });
      refs.inquiryForm.reset();
      if (refs.inquiryToast) {
        refs.inquiryToast.hidden = false;
        setTimeout(() => {
          refs.inquiryToast.hidden = true;
        }, 2400);
      }
      setInquiryOpen(false);
      logActivity("사이트 문의를 저장했습니다. (로컬)");
    });
  }

  function openBugTargetModal() {
    if (!refs.bugTargetModal) return;
    refs.bugTargetModal.hidden = false;
    refs.bugTargetModal.setAttribute("aria-hidden", "false");
    if (refs.bugTargetMessage) {
      refs.bugTargetMessage.placeholder = BUG_REPORT_PLACEHOLDER;
      refs.bugTargetMessage.focus();
    }
    if (refs.bugTargetToast) refs.bugTargetToast.hidden = true;
  }

  function closeBugTargetModal(opts) {
    if (!refs.bugTargetModal) return;
    refs.bugTargetModal.hidden = true;
    refs.bugTargetModal.setAttribute("aria-hidden", "true");
    if (refs.bugTargetMessage) refs.bugTargetMessage.placeholder = "";
    if (opts?.focusComplete && refs.completeMissionBtn) {
      refs.completeMissionBtn.focus();
    } else if (refs.bugTargetLaunchBtn && !refs.bugTargetLaunchBtn.hidden) {
      refs.bugTargetLaunchBtn.focus();
    }
  }

  function setupBugTargetModal() {
    if (refs.bugTargetLaunchBtn) {
      refs.bugTargetLaunchBtn.addEventListener("click", () => openBugTargetModal());
    }
    if (refs.bugTargetModalClose) {
      refs.bugTargetModalClose.addEventListener("click", () => closeBugTargetModal());
    }
    if (refs.bugTargetModal) {
      refs.bugTargetModal.addEventListener("click", (e) => {
        if (e.target === refs.bugTargetModal) closeBugTargetModal();
      });
    }
    if (refs.bugTargetForm) {
      refs.bugTargetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = String(refs.bugTargetMessage?.value || "").trim();
        if (!msg) return;
        QA.addReport({
          userEmail: userKey,
          missionId: mission.id,
          missionTitle: mission.title,
          category: "bug",
          message: msg,
          scope: "target_bug"
        });
        refs.bugTargetForm.reset();
        targetBugReportSaved = true;
        updateCompleteButton();
        if (refs.bugTargetToast) {
          refs.bugTargetToast.hidden = false;
          setTimeout(() => {
            refs.bugTargetToast.hidden = true;
          }, 2400);
        }
        logActivity("테스트 대상 버그 제보를 저장했습니다. 이제 미션 완료를 누를 수 있습니다.");
        closeBugTargetModal({ focusComplete: true });
      });
    }
  }

  function syncReportFormPlaceholder() {
    const ta = refs.reportMessage;
    if (!ta) return;
    ta.placeholder = DEFAULT_REPORT_PLACEHOLDER;
  }

  function setGuideReportOpen(open, opts = {}) {
    if (open && !opts.skipCloseOther && refs.inquiryWidget && !refs.inquiryWidget.hidden) {
      setInquiryOpen(false, { skipCloseOther: true });
    }
    const w = refs.reportWidget;
    const b = refs.reportBackdrop;
    const btn = refs.guideReportOpenBtn;
    if (!w || !b) return;
    w.hidden = !open;
    b.hidden = !open;
    b.setAttribute("aria-hidden", open ? "false" : "true");
    if (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.classList.toggle("is-open", open);
    }
    if (open) {
      syncReportFormPlaceholder();
      refs.reportMessage?.focus();
    } else {
      if (refs.reportMessage) refs.reportMessage.placeholder = DEFAULT_REPORT_PLACEHOLDER;
      if (!opts.skipCloseOther) btn?.focus();
    }
  }

  function setInquiryOpen(open, opts = {}) {
    if (open && !opts.skipCloseOther && refs.reportWidget && !refs.reportWidget.hidden) {
      setGuideReportOpen(false, { skipCloseOther: true });
    }
    const w = refs.inquiryWidget;
    const b = refs.inquiryBackdrop;
    const fab = refs.inquiryFab;
    if (!w || !b) return;
    w.hidden = !open;
    b.hidden = !open;
    b.setAttribute("aria-hidden", open ? "false" : "true");
    if (fab) {
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      fab.classList.toggle("is-open", open);
    }
    if (open) {
      refs.inquiryMessage?.focus();
    } else {
      if (!opts.skipCloseOther) fab?.focus();
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
    setReportChrome();

    if (refs.completeMissionBtn) {
      refs.completeMissionBtn.addEventListener("click", () => completeMissionAndLeave());
    }
    setupGuideReportWidget();
    setupInquiryWidget();
    setupModalEscape();
    setupBugTargetModal();
    checkState = {};
    if (useInteractiveSandbox()) {
      if (refs.sandboxToolbarLabel) {
        refs.sandboxToolbarLabel.textContent = "연습 데모 · 아래에서 누른 동작이 목표에 바로 반영";
      }
      mountInteractiveSandbox();
      if (refs.validatorStatus) refs.validatorStatus.textContent = "동작으로 목표 갱신";
      logActivity(
        "「문의하기」는 아래 연습 화면에서 눌러 주세요. 외부 iframe(다른 도메인) 안의 클릭은 브라우저 보안 때문에 이 페이지에서 감지할 수 없습니다. 비교용 실제 사이트는 상단 링크입니다."
      );
    } else {
      tearDownInteractiveSandbox();
      if (refs.sandboxToolbarLabel) {
        refs.sandboxToolbarLabel.textContent = "테스트 대상 · SEO DEMO (iframe)";
      }
      if (refs.externalSiteFrame) {
        refs.externalSiteFrame.hidden = false;
        refs.externalSiteFrame.src = "https://meowdule.github.io/SEO-TESTING-HTML/";
      }
      renderObjectives();
    }
    setupActivityReset();
    setupReportSubmit();
    setupInquirySubmit();
    setupValidationControls();
    if (!useInteractiveSandbox()) {
      runAutoValidation();
    }
  }

  init();
})();


(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const missionId = params.get("m");
  const fromParam = params.get("from");

  function exitListHref() {
    if (fromParam === "challenge") return QA.learnerHref.challenges();
    if (fromParam === "tc_lab") return QA.learnerHref.tcLab();
    return QA.learnerHref.home();
  }

  function exitListBackLabel() {
    if (fromParam === "challenge") return "← 챌린지 목록";
    if (fromParam === "tc_lab") return "← TC 작성 실습";
    return "← 시나리오 목록";
  }

  function playUrlWithContext() {
    if (!missionId) return "./play.html";
    const q = new URLSearchParams({ m: missionId });
    if (fromParam === "challenge") q.set("from", "challenge");
    if (fromParam === "tc_lab") q.set("from", "tc_lab");
    return `./play.html?${q.toString()}`;
  }

  const refs = {
    title: document.getElementById("missionTitle"),
    type: document.getElementById("missionType"),
    difficulty: document.getElementById("missionDifficulty"),
    summary: document.getElementById("missionSummary"),
    description: document.getElementById("missionDescription"),
    objectives: document.getElementById("objectiveList"),
    activity: document.getElementById("activityLog"),
    activityLogSection: document.getElementById("activityLogSection"),
    sandbox: document.getElementById("sandboxMount"),
    sandboxMount: document.getElementById("sandboxMount"),
    playWorkArea: document.getElementById("playWorkArea"),
    missionDefectBlock: document.getElementById("missionDefectBlock"),
    missionDefectForm: document.getElementById("missionDefectForm"),
    defectSteps: document.getElementById("defectSteps"),
    defectExpected: document.getElementById("defectExpected"),
    defectActual: document.getElementById("defectActual"),
    defectEnv: document.getElementById("defectEnv"),
    defectPrereq: document.getElementById("defectPrereq"),
    missionDefectToast: document.getElementById("missionDefectToast"),
    missionTcBlock: document.getElementById("missionTcBlock"),
    missionTcForm: document.getElementById("missionTcForm"),
    tcPracticeId: document.getElementById("tcPracticeId"),
    tcPremises: document.getElementById("tcPremises"),
    tcSteps: document.getElementById("tcSteps"),
    tcExpected: document.getElementById("tcExpected"),
    missionTcToast: document.getElementById("missionTcToast"),
    apiLabToolMount: document.getElementById("apiLabToolMount"),
    playFloatActions: document.getElementById("playFloatActions"),
    externalSiteFrame: document.getElementById("externalSiteFrame"),
    validatorStatus: document.getElementById("validatorStatus"),
    runValidationBtn: document.getElementById("runValidationBtn"),
    inquiryFab: document.getElementById("inquiryFab"),
    inquiryWidget: document.getElementById("inquiryWidget"),
    inquiryBackdrop: document.getElementById("inquiryBackdrop"),
    inquiryForm: document.getElementById("inquiryForm"),
    inquiryMessage: document.getElementById("inquiryMessage"),
    inquiryWidgetClose: document.getElementById("inquiryWidgetClose"),
    inquiryToast: document.getElementById("inquiryToast"),
    completeMissionBtn: document.getElementById("completeMissionBtn"),
    activityClearBtn: document.getElementById("activityClearBtn"),
    progressText: document.getElementById("progressText"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    currentGuide: document.getElementById("currentGuide"),
    difficultyHint: document.getElementById("difficultyHint"),
    backLink: document.getElementById("backHome"),
    sandboxInteractiveHost: document.getElementById("sandboxInteractiveHost"),
    sandboxToolbarLabel: document.getElementById("sandboxToolbarLabel"),
    playScenarioContext: document.getElementById("playScenarioContext"),
    playScenarioContextTitle: document.getElementById("playScenarioContextTitle"),
    playScenarioContextSummary: document.getElementById("playScenarioContextSummary"),
    playScenarioContextBody: document.getElementById("playScenarioContextBody")
  };

  function getSandboxHost() {
    return refs.sandboxInteractiveHost || refs.sandboxMount || refs.sandbox;
  }

  function isApiLabMission() {
    const pl = mission?.sandbox?.playLayout;
    return pl === "postman_lab" || pl === "swagger_lab";
  }

  function useInteractiveSandbox() {
    return Boolean(mission?.sandbox) && !isApiLabMission();
  }

  function isDefectReportMission() {
    return mission?.type === "defect_report";
  }

  function isTcAuthoringMission() {
    return mission?.type === "tc_authoring";
  }

  function usesMissionDefectForm() {
    return useInteractiveSandbox() && mission?.type === "defect_report";
  }

  function usesMissionTcForm() {
    return useInteractiveSandbox() && isTcAuthoringMission();
  }

  function missionTypeLabel() {
    if (isBugMission()) return "버그 탐지";
    if (isDefectReportMission()) return "결함 제보";
    if (isTcAuthoringMission()) return "TC 작성";
    return "성공 시나리오";
  }

  function setPlayFloatVisibility() {
    const el = refs.playFloatActions;
    if (!el) return;
    el.hidden = isApiLabMission();
  }

  function syncMissionPanelChrome() {
    const defectBlock = refs.missionDefectBlock;
    const tcBlock = refs.missionTcBlock;
    const actSection = refs.activityLogSection;
    if (defectBlock) {
      defectBlock.hidden = !usesMissionDefectForm();
      const lead = defectBlock.querySelector(".mission-defect-lead");
      if (lead) {
        lead.textContent = "재현 단계·기대·실제 결과를 적고 저장한 뒤 실습 완료를 누르세요.";
      }
    }
    if (tcBlock) {
      tcBlock.hidden = !usesMissionTcForm();
      const lead = tcBlock.querySelector(".mission-tc-lead");
      if (lead) {
        lead.textContent =
          "아래 「이번 연습 주제」를 참고해 데모를 살펴본 뒤, TC ID·전제·단계·기대 결과를 적고 저장하세요. (너무 짧으면 저장으로 인정되지 않습니다.)";
      }
    }
    if (actSection) {
      actSection.hidden = isDefectReportMission() || isTcAuthoringMission();
    }
  }

  function configurePlayLayouts() {
    const work = refs.playWorkArea;
    if (work) {
      work.classList.remove("play-work-area--api-lab", "play-work-area--defect-split");
    }
    if (refs.apiLabToolMount) {
      refs.apiLabToolMount.hidden = true;
      refs.apiLabToolMount.innerHTML = "";
    }
    if (refs.sandboxMount) refs.sandboxMount.hidden = false;
    setPlayFloatVisibility();
    syncMissionPanelChrome();

    if (isApiLabMission()) {
      if (work) work.classList.add("play-work-area--api-lab");
      if (refs.sandboxMount) refs.sandboxMount.hidden = true;
      if (refs.apiLabToolMount) refs.apiLabToolMount.hidden = false;
      if (QA.playApiLab) {
        QA.playApiLab.resetApiLabState();
        const tool = refs.apiLabToolMount;
        if (tool && mission.sandbox.playLayout === "postman_lab") {
          QA.playApiLab.mountPostmanPanel(tool, (msg) => logActivity(msg));
        } else if (tool) {
          QA.playApiLab.mountSwaggerPanel(tool, (msg) => logActivity(msg));
        }
      }
      if (refs.sandboxToolbarLabel) refs.sandboxToolbarLabel.textContent = "Postman 스타일 연습 데모";
      if (mission.sandbox.playLayout === "swagger_lab" && refs.sandboxToolbarLabel) {
        refs.sandboxToolbarLabel.textContent = "Swagger UI 스타일 연습 데모";
      }
    } else if (useInteractiveSandbox() && refs.sandboxToolbarLabel) {
      if (isDefectReportMission()) {
        refs.sandboxToolbarLabel.textContent = "연습 데모 (테스트 대상)";
      } else if (isTcAuthoringMission()) {
        refs.sandboxToolbarLabel.textContent = "연습 데모 · 시나리오 수행 후 왼쪽에 TC를 정리";
      } else {
        refs.sandboxToolbarLabel.textContent = "연습 데모 · 아래에서 누른 동작이 목표에 바로 반영";
      }
    }
  }

  const userKey = QA.getProgressUserKey();
  let mission = null;
  let progress = null;
  /** 결함 제보 전용 미션(defect_report)에서 양식 저장 후 true */
  let standaloneDefectReportSaved = false;
  let loggedBugNextDefectHint = false;
  let checkState = {};
  let validationTimer = null;
  let lastValidationSignature = "";
  let skippedValidatorContextLogged = false;
  let sandboxApp = null;
  const VALIDATOR_BASES = ["http://127.0.0.1:4173", "http://localhost:4173"];
  function tearDownInteractiveSandbox() {
    sandboxApp = null;
    const host = getSandboxHost();
    if (refs.sandboxInteractiveHost) {
      refs.sandboxInteractiveHost.innerHTML = "";
      refs.sandboxInteractiveHost.hidden = true;
    }
    if (host && host !== refs.sandboxInteractiveHost) {
      host.innerHTML = "";
    }
    if (refs.externalSiteFrame) {
      refs.externalSiteFrame.hidden = false;
      refs.externalSiteFrame.removeAttribute("aria-hidden");
    }
  }

  function mergePlaySnapshot() {
    const base = sandboxApp ? sandboxApp.getSnapshot() : {};
    const lab = QA.playApiLab && typeof QA.playApiLab.getApiLabSnapshot === "function" ? QA.playApiLab.getApiLabSnapshot() : {};
    return Object.assign({}, base, lab);
  }

  function applyChecksFromSandbox() {
    if (!mission) return;
    const snap = mergePlaySnapshot();
    const extra = { missionId: mission.id, userEmail: userKey || null };
    const next = {};
    mission.objectives.forEach((o) => {
      next[o.checkId] = QA.evaluateCheck(o.checkId, snap, extra);
    });
    checkState = next;
    renderObjectives();
  }

  function mountInteractiveSandbox() {
    const host = getSandboxHost();
    if (!host || typeof QA.SandboxApp !== "function") {
      if (!isTcAuthoringMission()) {
        logActivity("연습 화면(SandboxApp)을 불러오지 못했습니다. sandbox.js 스크립트를 확인하세요.");
      }
      return;
    }
    tearDownInteractiveSandbox();
    host.hidden = false;
    if (refs.externalSiteFrame) {
      refs.externalSiteFrame.hidden = true;
      refs.externalSiteFrame.setAttribute("aria-hidden", "true");
    }
    const profilePayload = {
      lastSignupEmail: progress.lastSignupEmail,
      lastSignupName: progress.lastSignupName
    };
    sandboxApp = new QA.SandboxApp(host, mission, profilePayload, (msg) => {
      if (!isTcAuthoringMission()) logActivity(msg);
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
      window.location.href = QA.learnerHref.home();
      return;
    }
    const next = playUrlWithContext().replace(/^\.\//, "");
    window.location.href = QA.learnerHref.login(next);
  }

  function isBugMission() {
    return mission?.type === "bug_hunt";
  }

  function allObjectivesMet() {
    if (!mission) return false;
    if (isDefectReportMission()) return standaloneDefectReportSaved;
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
    if (isDefectReportMission()) {
      btn.disabled = !standaloneDefectReportSaved;
      btn.textContent = standaloneDefectReportSaved ? "실습 완료 · 목록으로" : "결함 제보 저장 후 완료";
      return;
    }
    const ok = allObjectivesMet();
    btn.disabled = !ok;
    btn.textContent = "실습 완료 · 목록으로";
  }

  function renderObjectives() {
    if (!mission) return;
    syncMissionPanelChrome();
    const objBlock = document.getElementById("missionObjectivesBlock");
    if (isDefectReportMission() || isTcAuthoringMission()) {
      if (objBlock) objBlock.hidden = true;
      updateCompleteButton();
      return;
    }
    if (objBlock) objBlock.hidden = false;
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
    if (isBugMission() && allObjectivesMet() && !loggedBugNextDefectHint) {
      loggedBugNextDefectHint = true;
      const dr =
        typeof QA.pairedDefectReportMissionId === "function" ? QA.pairedDefectReportMissionId(mission.id) : null;
      const drTitle = dr ? QA.getMissionById(dr)?.title : null;
      logActivity(
        dr
          ? `버그 목표를 모두 달성했습니다. 실습 완료 후 같은 묶음의 「${drTitle || dr}」에서 결함 제보를 작성하세요. (상세: ${QA.learnerHref.mission(dr, { detail: true })})`
          : "버그 목표를 모두 달성했습니다. 실습 완료 후 이어지는 결함 제보 과정을 진행하세요."
      );
    }
    updateCompleteButton();
  }

  function completeMissionAndLeave() {
    if (!mission || !allObjectivesMet()) return;
    if (isDefectReportMission() && !standaloneDefectReportSaved) {
      alert("왼쪽 패널의 결함 제보를 저장한 뒤 완료할 수 있습니다.");
      return;
    }
    const prog = QA.getProgress(userKey);
    if (!prog.completedMissionIds.includes(mission.id)) {
      QA.markMissionComplete(userKey, mission.id);
      if (!isTcAuthoringMission()) logActivity(`실습 클리어! +${mission.points}점`);
    }
    window.location.href = exitListHref();
  }

  async function runAutoValidation() {
    if (!mission) return;
    if (useInteractiveSandbox() || isApiLabMission()) return;
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
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    const payload = {
      missionId: mission.id,
      targetUrl: origin ? `${origin.replace(/\/$/, "")}/index.html` : "",
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
    if (isApiLabMission()) {
      if (validationTimer) clearInterval(validationTimer);
      validationTimer = null;
      if (refs.runValidationBtn) refs.runValidationBtn.hidden = true;
      if (refs.validatorStatus) refs.validatorStatus.textContent = "패널에서 요청 후 목표 갱신";
      return;
    }
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
      returnPath: playUrlWithContext()
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
          window.location.href = QA.learnerHref.mission(missionId);
        }
      });
    } else {
      window.location.href = QA.learnerHref.mission(missionId);
    }
    return false;
  }

  function syncPlayScenarioContext() {
    const wrap = refs.playScenarioContext;
    if (!wrap) return;
    if (!isTcAuthoringMission()) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const tp = mission.tcPracticeTopic;
    if (tp && typeof tp === "object") {
      if (refs.playScenarioContextTitle) {
        refs.playScenarioContextTitle.textContent = tp.headline || mission.title;
      }
      if (refs.playScenarioContextSummary) {
        refs.playScenarioContextSummary.textContent = tp.summary != null ? String(tp.summary) : "";
      }
      if (refs.playScenarioContextBody) {
        refs.playScenarioContextBody.innerHTML = String(tp.detail || "").replace(/\n/g, "<br>");
      }
    } else {
      if (refs.playScenarioContextTitle) refs.playScenarioContextTitle.textContent = mission.title;
      if (refs.playScenarioContextSummary) refs.playScenarioContextSummary.textContent = mission.summary || "";
      if (refs.playScenarioContextBody) {
        refs.playScenarioContextBody.innerHTML = String(mission.description || "").replace(/\n/g, "<br>");
      }
    }
  }

  function setMissionContent() {
    refs.title.textContent = mission.title;
    refs.difficulty.textContent = mission.difficulty;
    refs.type.textContent = missionTypeLabel();
    refs.type.className = `pill type-${mission.type}`;
    if (isTcAuthoringMission()) {
      refs.summary.textContent = "";
      refs.description.innerHTML = "";
    } else {
      refs.summary.textContent = mission.summary;
      refs.description.innerHTML = mission.description.replace(/\n/g, "<br>");
    }
    syncPlayScenarioContext();
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
      if (refs.inquiryWidget && !refs.inquiryWidget.hidden) {
        setInquiryOpen(false);
        return;
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
    standaloneDefectReportSaved = false;
    loggedBugNextDefectHint = false;
    checkState = {};
    setInquiryOpen(false);
    if (refs.missionDefectForm) refs.missionDefectForm.reset();
    if (refs.missionTcForm) refs.missionTcForm.reset();
    if (isApiLabMission() && QA.playApiLab) {
      QA.playApiLab.resetApiLabState();
      const tool = refs.apiLabToolMount;
      if (tool) {
        tool.innerHTML = "";
        if (mission.sandbox.playLayout === "postman_lab") {
          QA.playApiLab.mountPostmanPanel(tool, (msg) => logActivity(msg));
        } else {
          QA.playApiLab.mountSwaggerPanel(tool, (msg) => logActivity(msg));
        }
      }
      applyChecksFromSandbox();
    } else if (useInteractiveSandbox()) {
      if (sandboxApp) sandboxApp.resetToInitial(true);
      applyChecksFromSandbox();
    } else {
      renderObjectives();
      if (refs.externalSiteFrame && refs.externalSiteFrame.src) {
        refs.externalSiteFrame.src = "about:blank";
      }
      runAutoValidation();
    }
    if (logMessage && !isTcAuthoringMission()) {
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
      if (isBugMission()) {
        const dr =
          typeof QA.pairedDefectReportMissionId === "function" ? QA.pairedDefectReportMissionId(mission.id) : null;
        refs.currentGuide.textContent = dr
          ? "목표를 모두 달성했습니다. 실습 완료 후 이어지는 결함 제보 과정에서 양식을 작성하세요."
          : "목표를 모두 달성했습니다. 실습 완료 후 안내에 따라 결함 제보를 진행하세요.";
      } else {
        refs.currentGuide.textContent = "모든 목표를 달성했습니다. 실습 완료 버튼을 눌러 제출하세요.";
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

  function setupTcPracticeForm() {
    if (!refs.missionTcForm) return;
    refs.missionTcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!usesMissionTcForm()) return;
      const idLine = String(refs.tcPracticeId?.value || "").trim();
      const pre = String(refs.tcPremises?.value || "").trim();
      const steps = String(refs.tcSteps?.value || "").trim();
      const exp = String(refs.tcExpected?.value || "").trim();
      if (!pre || !steps || !exp) {
        alert("전제, 수행 단계, 기대 결과는 필수입니다.");
        return;
      }
      const tcIdLine = idLine || `(TC ID 미입력 · 미션 ${mission.id})`;
      const msg = `[TC ID]\n${tcIdLine}\n\n[전제]\n${pre}\n\n[수행 단계]\n${steps}\n\n[기대 결과]\n${exp}`;
      QA.addReport({
        userEmail: userKey,
        missionId: mission.id,
        missionTitle: mission.title,
        category: "tc_practice",
        message: msg,
        scope: "tc_practice"
      });
      if (refs.missionTcToast) {
        refs.missionTcToast.hidden = false;
        setTimeout(() => {
          refs.missionTcToast.hidden = true;
        }, 2400);
      }
      applyChecksFromSandbox();
      renderObjectives();
    });
  }

  function setupMissionDefectForm() {
    if (!refs.missionDefectForm) return;
    refs.missionDefectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isDefectReportMission()) return;
      const prereq = String(refs.defectPrereq?.value || "").trim();
      const steps = String(refs.defectSteps?.value || "").trim();
      const exp = String(refs.defectExpected?.value || "").trim();
      const actu = String(refs.defectActual?.value || "").trim();
      const env = String(refs.defectEnv?.value || "").trim();
      if (!steps || !exp || !actu) {
        alert("재현 단계, 기대 결과, 실제 결과는 필수입니다.");
        return;
      }
      const head = prereq ? `[선행 조건 / 완료한 버그 과정]\n${prereq}\n\n` : "";
      const msg = `${head}[재현 단계]\n${steps}\n\n[기대 결과]\n${exp}\n\n[실제 결과]\n${actu}\n\n[환경]\n${env || "—"}`;
      QA.addReport({
        userEmail: userKey,
        missionId: mission.id,
        missionTitle: mission.title,
        category: "bug",
        message: msg,
        scope: "defect_report_mission"
      });
      refs.missionDefectForm.reset();
      standaloneDefectReportSaved = true;
      updateCompleteButton();
      if (useInteractiveSandbox()) applyChecksFromSandbox();
      if (refs.missionDefectToast) {
        refs.missionDefectToast.hidden = false;
        setTimeout(() => {
          refs.missionDefectToast.hidden = true;
        }, 2400);
      }
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
      if (useInteractiveSandbox()) applyChecksFromSandbox();
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

  function setInquiryOpen(open, opts = {}) {
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
      window.location.href = QA.learnerHref.home();
      return;
    }
    mission = QA.getMissionById(missionId);
    if (!mission) {
      alert("알 수 없는 미션입니다.");
      window.location.href = QA.learnerHref.home();
      return;
    }

    progress = QA.getProgress(userKey);
    if (!ensureMissionUnlocked()) {
      return;
    }

    refs.backLink.href = exitListHref();
    refs.backLink.textContent = exitListBackLabel();
    mountPlayAuthNav();
    setMissionContent();
    configurePlayLayouts();
    syncMissionPanelChrome();

    if (refs.completeMissionBtn) {
      refs.completeMissionBtn.addEventListener("click", () => completeMissionAndLeave());
    }
    setupInquiryWidget();
    setupModalEscape();
    setupMissionDefectForm();
    setupTcPracticeForm();
    checkState = {};
    if (isApiLabMission()) {
      if (refs.validatorStatus) refs.validatorStatus.textContent = "패널에서 요청 후 목표 갱신";
      applyChecksFromSandbox();
      logActivity("우측 데모 패널에서 컬렉션 항목을 누르거나 Send로 목표(목록·필터·단건·문의)를 채우세요.");
    } else if (useInteractiveSandbox()) {
      mountInteractiveSandbox();
      if (refs.validatorStatus) refs.validatorStatus.textContent = "동작으로 목표 갱신";
      if (!isTcAuthoringMission()) {
        logActivity("아래 연습 데모에서 버튼·폼을 조작하면 왼쪽 목표와 활동 로그가 갱신됩니다.");
      }
    } else {
      tearDownInteractiveSandbox();
      if (refs.sandboxToolbarLabel) {
        refs.sandboxToolbarLabel.textContent = "테스트 대상 (iframe)";
      }
      if (refs.externalSiteFrame) {
        refs.externalSiteFrame.hidden = false;
        refs.externalSiteFrame.src = "about:blank";
      }
      renderObjectives();
    }
    setupActivityReset();
    setupInquirySubmit();
    setupValidationControls();
    if (!useInteractiveSandbox() && !isApiLabMission()) {
      runAutoValidation();
    }
  }

  init();
})();


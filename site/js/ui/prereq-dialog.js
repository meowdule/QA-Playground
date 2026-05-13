/**
 * 선행 미션 안내 — 네: 선행 미션 수행(play) 화면으로, 아니오: onNo 콜백 또는 닫기만
 */
(function () {
  function openPrereqDialog(opts) {
    const { blockerId, blockerTitle, onNo } = opts || {};
    if (!blockerId || !blockerTitle) return;

    const backdrop = document.createElement("div");
    backdrop.className = "site-modal-backdrop";

    const panel = document.createElement("div");
    panel.className = "site-modal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "prereqModalTitle");

    const title = document.createElement("h2");
    title.id = "prereqModalTitle";
    title.className = "site-modal-title";
    title.textContent = "선행 미션이 필요합니다";

    const p1 = document.createElement("p");
    p1.className = "site-modal-text";
    p1.textContent = "이 미션을 수행하려면 아래 선행 미션을 먼저 완료해야 합니다.";

    const p2 = document.createElement("p");
    p2.className = "site-modal-text site-modal-em";
    const strong = document.createElement("strong");
    strong.textContent = `「${blockerTitle}」`;
    p2.append(strong);
    p2.appendChild(document.createTextNode(" 미션을 수행하시겠습니까?"));

    const row = document.createElement("div");
    row.className = "site-modal-actions";

    const btnNo = document.createElement("button");
    btnNo.type = "button";
    btnNo.className = "btn-site-secondary site-modal-btn";
    btnNo.textContent = "아니오";

    const btnYes = document.createElement("button");
    btnYes.type = "button";
    btnYes.className = "btn-site-primary site-modal-btn";
    btnYes.textContent = "네";

    function cleanup() {
      document.removeEventListener("keydown", onKey);
      backdrop.remove();
    }

    function onKey(e) {
      if (e.key === "Escape") {
        cleanup();
        if (onNo) onNo();
      }
    }

    btnYes.addEventListener("click", () => {
      cleanup();
      window.location.href = `./play.html?m=${encodeURIComponent(blockerId)}`;
    });
    btnNo.addEventListener("click", () => {
      cleanup();
      if (onNo) onNo();
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        cleanup();
        if (onNo) onNo();
      }
    });

    document.addEventListener("keydown", onKey);
    row.append(btnNo, btnYes);
    panel.append(title, p1, p2, row);
    backdrop.append(panel);
    document.body.appendChild(backdrop);
    btnYes.focus();
  }

  window.QA = window.QA || {};
  window.QA.openPrereqDialog = openPrereqDialog;
})();


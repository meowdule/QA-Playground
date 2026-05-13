/**
 * 학습자 UI용 확인 대화상자 (네이티브 confirm 대체)
 */
(function (global) {
  const QA = (global.QA = global.QA || {});

  QA.openLearnerConfirm = function openLearnerConfirm(opts) {
    const {
      title = "확인",
      message = "",
      confirmText = "확인",
      cancelText = "취소"
    } = opts || {};

    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "site-modal-backdrop";

      const panel = document.createElement("div");
      panel.className = "site-modal-panel site-modal-panel--compact";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "learnerConfirmTitle");

      const h = document.createElement("h2");
      h.id = "learnerConfirmTitle";
      h.className = "site-modal-title";
      h.textContent = title;

      const p = document.createElement("p");
      p.className = "site-modal-text";
      p.style.whiteSpace = "pre-line";
      p.textContent = message;

      const row = document.createElement("div");
      row.className = "site-modal-actions";

      const btnCancel = document.createElement("button");
      btnCancel.type = "button";
      btnCancel.className = "btn-site-secondary site-modal-btn";
      btnCancel.textContent = cancelText;

      const btnOk = document.createElement("button");
      btnOk.type = "button";
      btnOk.className = "btn-site-primary site-modal-btn";
      btnOk.textContent = confirmText;

      function cleanup() {
        document.removeEventListener("keydown", onKey);
        backdrop.remove();
      }

      function onKey(e) {
        if (e.key === "Escape") {
          cleanup();
          resolve(false);
        }
      }

      btnOk.addEventListener("click", () => {
        cleanup();
        resolve(true);
      });
      btnCancel.addEventListener("click", () => {
        cleanup();
        resolve(false);
      });
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          cleanup();
          resolve(false);
        }
      });

      document.addEventListener("keydown", onKey);
      row.append(btnCancel, btnOk);
      panel.append(h, p, row);
      backdrop.append(panel);
      document.body.appendChild(backdrop);
      btnOk.focus();
    });
  };
})(typeof window !== "undefined" ? window : globalThis);

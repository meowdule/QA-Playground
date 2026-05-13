/**
 * 챌린지 목록(#/challenges) — 시나리오 홈과 비슷한 카드 목록.
 */
export function initChallengeListPage() {
  const QA = window.QA;

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    QA.mountAuthNav(slot, { returnPath: QA.learnerHref.challenges() });
  }

  const root = document.getElementById("challengeCatalogRoot");
  if (!root || !QA || !Array.isArray(QA.missions)) return;

  const missions = QA.missions.filter((m) => m && m.challenge && typeof m.challenge === "object");
  root.textContent = "";

  if (!missions.length) {
    const p = document.createElement("p");
    p.className = "catalog-empty-hint";
    p.textContent = "challenge 블록이 정의된 미션이 없습니다.";
    root.appendChild(p);
    return;
  }

  for (const m of missions) {
    const ch = m.challenge;
    const card = document.createElement("a");
    card.className = "course-card course-card--challenge";
    card.href = `./play.html?m=${encodeURIComponent(m.id)}&from=challenge`;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const dest = card.href;
      const ask =
        typeof QA.openLearnerConfirm === "function"
          ? () =>
              QA.openLearnerConfirm({
                title: "테스트 화면으로 이동",
                message:
                  "플레이(테스트) 화면으로 이동합니다.\n\n타이머·실시간 채점은 아직 연결되어 있지 않으며, 연습용 데모만 열립니다.",
                confirmText: "이동",
                cancelText: "취소"
              })
          : () =>
              Promise.resolve(
                window.confirm(
                  "테스트(플레이) 화면으로 이동할까요?\n\n챌린지 타이머·실점수는 아직 연결되어 있지 않습니다."
                )
              );
      ask().then((ok) => {
        if (ok) window.location.href = dest;
      });
    });

    const bits = [];
    if (ch.timeLimitSec != null) bits.push(`제한 ${ch.timeLimitSec}초`);
    if (ch.scoreMax != null) bits.push(`만점 ${ch.scoreMax}`);
    const chMeta = bits.length ? bits.join(" · ") : "메타만 정의";

    card.innerHTML = `
        <h3 class="course-title">
          <span class="course-title-text">${escapeHtml(ch.title || "챌린지")}</span>
          <span class="site-badge is-muted">${escapeHtml(chMeta)}</span>
        </h3>
        <p class="course-desc">${escapeHtml(m.summary || "")}</p>
        <div class="course-foot">
          <span class="course-card-meta">
            <span class="site-badge type-${escapeHtml(m.type)}">${
              m.type === "bug_hunt"
                ? "버그"
                : m.type === "defect_report"
                  ? "결함 제보"
                  : m.type === "tc_authoring"
                    ? "TC 작성"
                    : "성공"
            }</span>
            <span class="site-badge is-muted">${escapeHtml(m.difficulty || "")}</span>
            <span class="site-badge is-point">${m.points}점</span>
          </span>
          <span class="course-more">테스트 화면 →</span>
        </div>
        <p class="challenge-card-mission-ref muted small">연결 시나리오 · ${escapeHtml(m.title)}</p>
      `;
    root.appendChild(card);
  }
}

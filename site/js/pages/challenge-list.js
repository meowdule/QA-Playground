/**
 * 챌린지 목록(#/challenges, #/challenges/:track)
 * — track별 제목·설명만 다르고 목록은 동일(추후 메타 필터 연동).
 */
const DEFAULT_DESC_HTML =
  "카탈로그에 <code>challenge</code> 가 붙은 시나리오만 모았습니다. 카드를 누르면 확인 후 <strong>바로 플레이(테스트 화면)</strong>로 들어갑니다. 타이머·실점수는 아직 연결되어 있지 않습니다.";

const TRACK_COPY = {
  theory: {
    title: "이론 챌린지",
    desc: "1과목 대비 안내입니다. 아래는 전체 챌린지 목록이며, 과목별 필터는 카탈로그 메타가 붙으면 연결합니다.",
    doc: "이론 챌린지 · 테스피어-Tespier"
  },
  tc: {
    title: "TC 챌린지",
    desc: "2과목 대비 안내입니다. 현재 목록은 전체 챌린지와 동일합니다.",
    doc: "TC 챌린지 · 테스피어-Tespier"
  },
  defect: {
    title: "결함 챌린지",
    desc: "3과목 대비 안내입니다. 결함·버그 성격 챌린지를 모을 예정입니다.",
    doc: "결함 챌린지 · 테스피어-Tespier"
  },
  mock: {
    title: "모의고사",
    desc: "전과목 시뮬레이션 진입입니다. 현재는 전체 챌린지와 동일한 목록입니다.",
    doc: "모의고사 · 테스피어-Tespier"
  }
};

/** @param {{ track?: string }} [opts] */
export function initChallengeListPage(opts) {
  const QA = window.QA;
  const track = (opts && opts.track) || "";
  const copy = TRACK_COPY[track];

  const titleEl = document.getElementById("challengePageTitle");
  const descEl = document.getElementById("challengePageDesc");
  if (titleEl) titleEl.textContent = copy ? copy.title : "챌린지";
  if (descEl) {
    if (copy) descEl.textContent = copy.desc;
    else descEl.innerHTML = DEFAULT_DESC_HTML;
  }
  if (copy) document.title = copy.doc;
  else document.title = "챌린지 · 테스피어-Tespier";

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const slot = document.getElementById("authNavSlot");
  if (slot && typeof QA.mountAuthNav === "function") {
    const ret =
      track && typeof QA.learnerHref.challengesTrack === "function"
        ? QA.learnerHref.challengesTrack(track)
        : QA.learnerHref.challenges();
    QA.mountAuthNav(slot, { returnPath: ret });
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

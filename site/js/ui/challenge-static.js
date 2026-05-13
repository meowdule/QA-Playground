/**
 * challenge 미션 메타 정적 렌더링 (타이머·점수 로직 없음).
 * challenge-preview.html · 관리자 챌린지 표에서 공유.
 */
(function () {
  const g = (window.QA = window.QA || {});

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatTimeLimitSec(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${pad2(m)}:${pad2(r)}`;
  }

  function appendList(root, title, items) {
    if (!items || !items.length) return;
    const h = document.createElement("h3");
    h.className = "challenge-static-subtitle";
    h.textContent = title;
    root.appendChild(h);
    const ul = document.createElement("ul");
    ul.className = "challenge-static-list";
    for (const line of items) {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    }
    root.appendChild(ul);
  }

  function buildChallengeArticle(mission) {
    const ch = mission.challenge;
    if (!ch || typeof ch !== "object") return null;
    const art = document.createElement("article");
    art.className = "challenge-static-card";
    art.id = `challenge-${mission.id}`;

    const head = document.createElement("header");
    head.className = "challenge-static-card-head";
    const titleRow = document.createElement("div");
    titleRow.className = "challenge-static-title-row";
    const h2 = document.createElement("h2");
    h2.className = "challenge-static-card-title";
    h2.textContent = ch.title || "챌린지(미리보기)";
    const badge = document.createElement("span");
    badge.className = "site-badge is-muted";
    badge.textContent = "정적 표시";
    titleRow.appendChild(h2);
    titleRow.appendChild(badge);

    const sub = document.createElement("p");
    sub.className = "challenge-static-mission-ref";
    const la = document.createElement("a");
    la.href = `./play.html?m=${encodeURIComponent(mission.id)}`;
    la.textContent = mission.title;
    sub.appendChild(document.createTextNode("미션 · "));
    sub.appendChild(la);
    sub.appendChild(document.createTextNode(` (${mission.id})`));
    head.appendChild(titleRow);
    head.appendChild(sub);
    art.appendChild(head);

    const body = document.createElement("div");
    body.className = "challenge-static-card-body";

    const timerRow = document.createElement("div");
    timerRow.className = "challenge-static-timer-row";
    if (ch.timeLimitSec != null) {
      const box = document.createElement("div");
      box.className = "challenge-static-timer-face";
      box.setAttribute("aria-hidden", "true");
      box.textContent = formatTimeLimitSec(ch.timeLimitSec);
      timerRow.appendChild(box);
      const cap = document.createElement("p");
      cap.className = "challenge-static-timer-caption";
      cap.textContent = `제한 시간 ${ch.timeLimitSec}초 — 카운트다운 없음(표시만)`;
      timerRow.appendChild(cap);
    } else {
      const cap = document.createElement("p");
      cap.className = "challenge-static-timer-caption muted";
      cap.textContent = "제한 시간 미정의";
      timerRow.appendChild(cap);
    }
    body.appendChild(timerRow);

    if (ch.scoreMax != null) {
      const score = document.createElement("p");
      score.className = "challenge-static-score";
      score.textContent = `만점 ${ch.scoreMax} (실시간 점수 없음)`;
      body.appendChild(score);
    }

    appendList(body, "승리 조건(스키마)", ch.winConditions);
    appendList(body, "감점·실패 노트(예정)", ch.penaltyNotes);

    if (ch.staticNote) {
      const note = document.createElement("p");
      note.className = "challenge-static-note muted";
      note.textContent = ch.staticNote;
      body.appendChild(note);
    }

    art.appendChild(body);
    return art;
  }

  g.challengeStatic = {
    formatTimeLimitSec,
    buildChallengeArticle,
    missionsWithChallenge(missions) {
      return (missions || []).filter((m) => m && m.challenge && typeof m.challenge === "object");
    }
  };
})();

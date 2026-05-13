/**
 * 미션 카탈로그 Phase 1 메타: chapter, levelCode, sandbox.entryRoute, sandbox.headerProfile
 * - sandbox.entryRoute / headerProfile 은 미션 JSON에 있으면 그대로 두고(allowedRoutes 검증만), 없을 때만 추론한다.
 * missions.js / missions-seo.js보다 먼저 로드한 뒤, 배열 정의 직후 QA.enrichMissionCatalog(missions) 호출.
 *
 * challenge (옵션): { title?, timeLimitSec?, scoreMax?, winConditions?, penaltyNotes?, staticNote? }
 *   — 타이머·점수는 UI 미리보기용 메타만; 런타임 로직은 연결하지 않음.
 */
(function (global) {
  const QA = (global.QA = global.QA || {});

  const ENTRY_ROUTE_PREFERENCE = [
    "landing",
    "contact",
    "apply",
    "plans",
    "signup",
    "login",
    "board",
    "post",
    "profile"
  ];

  const VALID_HEADER = new Set(["guest_nav", "auth_nav", "default"]);
  /** 학습자 카탈로그 챕터: 화면 / 포스트맨 스타일 / 스웨거·AI 스타일 (결함 제보는 챕터가 아니라 시나리오 안에서 처리) */
  const VALID_EXPLICIT_CHAPTER = new Set(["screen_test", "postman_test", "swagger_ai_test", "tc_authoring"]);

  function difficultyToLevelCode(difficulty) {
    const s = String(difficulty || "");
    if (s.includes("상급")) return "advanced";
    if (s.includes("중급")) return "mid";
    if (s.includes("초급")) return "junior";
    return "beginner";
  }

  function chapterFor(mission) {
    const ex = mission.chapter;
    if (typeof ex === "string" && VALID_EXPLICIT_CHAPTER.has(ex)) return ex;
    if (mission.generatedMeta) return "screen_test";
    return "screen_test";
  }

  function pickEntryRouteFallback(mission) {
    const allowedArr =
      mission.sandbox && mission.sandbox.allowedRoutes && mission.sandbox.allowedRoutes.length
        ? mission.sandbox.allowedRoutes
        : ["landing"];
    const allowed = new Set(allowedArr);
    for (const r of ENTRY_ROUTE_PREFERENCE) {
      if (allowed.has(r)) return r;
    }
    return allowed.has("landing") ? "landing" : allowedArr[0];
  }

  function resolveEntryRoute(mission) {
    const allowedArr =
      mission.sandbox && mission.sandbox.allowedRoutes && mission.sandbox.allowedRoutes.length
        ? mission.sandbox.allowedRoutes
        : ["landing"];
    const allowed = new Set(allowedArr);
    const raw = mission.sandbox && mission.sandbox.entryRoute;
    if (raw && allowed.has(raw)) {
      if (raw === "post" && allowed.has("board")) return "board";
      return raw;
    }
    return pickEntryRouteFallback(mission);
  }

  function resolveHeaderProfile(mission) {
    const raw = mission.sandbox && mission.sandbox.headerProfile;
    if (VALID_HEADER.has(raw)) return raw;
    if (mission.sandbox && mission.sandbox.preLoginSession) return "auth_nav";
    return "guest_nav";
  }

  QA.enrichMissionCatalog = function enrichMissionCatalog(missionList) {
    if (!Array.isArray(missionList)) return;
    for (const m of missionList) {
      m.chapter = chapterFor(m);
      m.levelCode = difficultyToLevelCode(m.difficulty);
      m.sandbox = m.sandbox || {};
      m.sandbox.entryRoute = resolveEntryRoute(m);
      m.sandbox.headerProfile = resolveHeaderProfile(m);
    }
  };

  const CHALLENGE_KEYS = new Set([
    "title",
    "timeLimitSec",
    "scoreMax",
    "winConditions",
    "penaltyNotes",
    "staticNote"
  ]);

  function validateChallengeBlock(mission, tag) {
    const ch = mission.challenge;
    if (ch == null) return;
    if (typeof ch !== "object" || Array.isArray(ch)) {
      throw new Error(`[${tag}] challenge는 객체여야 함: ${mission.id}`);
    }
    for (const k of Object.keys(ch)) {
      if (!CHALLENGE_KEYS.has(k)) {
        throw new Error(`[${tag}] challenge 알 수 없는 키 "${k}": ${mission.id}`);
      }
    }
    if (ch.title != null && typeof ch.title !== "string") {
      throw new Error(`[${tag}] challenge.title은 문자열: ${mission.id}`);
    }
    if (ch.staticNote != null && typeof ch.staticNote !== "string") {
      throw new Error(`[${tag}] challenge.staticNote는 문자열: ${mission.id}`);
    }
    if (ch.timeLimitSec != null) {
      const n = Number(ch.timeLimitSec);
      if (!Number.isFinite(n) || n < 0) {
        throw new Error(`[${tag}] challenge.timeLimitSec은 0 이상의 유한 숫자: ${mission.id}`);
      }
    }
    if (ch.scoreMax != null) {
      const n = Number(ch.scoreMax);
      if (!Number.isFinite(n) || n < 0) {
        throw new Error(`[${tag}] challenge.scoreMax는 0 이상의 유한 숫자: ${mission.id}`);
      }
    }
    function assertStringArray(field) {
      if (ch[field] == null) return;
      if (!Array.isArray(ch[field]) || ch[field].some((x) => typeof x !== "string")) {
        throw new Error(`[${tag}] challenge.${field}는 문자열 배열: ${mission.id}`);
      }
    }
    assertStringArray("winConditions");
    assertStringArray("penaltyNotes");
  }

  QA.validateMissionCatalog = function validateMissionCatalog(missionList, label) {
    const tag = label || "missions";
    for (const m of missionList) {
      const allowed = new Set(m.sandbox && m.sandbox.allowedRoutes ? m.sandbox.allowedRoutes : []);
      const er = m.sandbox && m.sandbox.entryRoute;
      if (!er || !allowed.has(er)) {
        throw new Error(`[${tag}] sandbox.entryRoute가 allowedRoutes에 없음: ${m.id} -> ${String(er)}`);
      }
      if (!m.chapter) throw new Error(`[${tag}] chapter 없음: ${m.id}`);
      if (!m.levelCode) throw new Error(`[${tag}] levelCode 없음: ${m.id}`);
      const hp = m.sandbox.headerProfile;
      if (!VALID_HEADER.has(hp)) {
        throw new Error(`[${tag}] sandbox.headerProfile이 유효하지 않음: ${m.id} -> ${String(hp)}`);
      }
      validateChallengeBlock(m, tag);
      const pl = m.sandbox && m.sandbox.playLayout;
      if (pl != null && pl !== "postman_lab" && pl !== "swagger_lab") {
        throw new Error(`[${tag}] sandbox.playLayout 값이 유효하지 않음: ${m.id} -> ${String(pl)}`);
      }
      const obj = m.objectives;
      if (m.type === "defect_report") {
        if (!Array.isArray(obj) || obj.length !== 0) {
          throw new Error(`[${tag}] defect_report 미션은 objectives가 빈 배열이어야 함: ${m.id}`);
        }
      } else if (!Array.isArray(obj) || obj.length < 1) {
        throw new Error(`[${tag}] objectives가 비어 있음: ${m.id}`);
      }
    }
  };
})(typeof window !== "undefined" ? window : globalThis);

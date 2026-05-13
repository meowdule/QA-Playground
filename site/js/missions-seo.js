/**
 * Phase 1: 별도 SEO 데모 카탈로그(정적 미리보기·챌린지 샘플).
 * - 레거시 메인 카탈로그는 js/missions.js
 * - sandbox.entryRoute·headerProfile 은 미션 JSON에 명시(없으면 enrich가 추론).
 */

const missions = [
  {
    id: "m_inquiry",
    title: "문의하기 · 폼 제출",
    difficulty: "입문",
    type: "success",
    points: 80,
    summary: "문의 화면으로 이동해 필수 항목을 채우고 제출까지 완료합니다.",
    description:
      "랜딩에서 문의하기로 들어가 제목과 내용을 입력한 뒤 문의 보내기를 눌러 제출이 완료되는지 확인합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "visited_contact", text: "문의하기 화면으로 이동한다." },
      { id: "o2", checkId: "submitted_contact_form", text: "문의 폼을 작성하고 제출한다." }
    ],
    challenge: {
      title: "스피드 런(미리보기)",
      timeLimitSec: 120,
      scoreMax: 100,
      winConditions: ["문의 화면에 진입한다.", "필수 항목을 채우고 제출까지 완료한다."],
      penaltyNotes: ["제한 시간 초과 시 감점(예정) — 현재는 표시만"],
      staticNote: "타이머·실시간 점수는 아직 연결되지 않았습니다. 카탈로그·미리보기 UI용 정의입니다."
    }
  },
  {
    id: "m_repeat_inquiry",
    title: "문의 폼 · 연속 제출",
    difficulty: "입문",
    type: "success",
    points: 75,
    summary: "문의하기에서 제출을 두 번 수행합니다.",
    description: "문의하기 화면에서 제목/내용을 입력해 제출한 뒤, 다시 입력해 한 번 더 제출합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "contact_submit_twice", text: "문의 폼을 두 번 제출한다." }]
  },
  {
    id: "m_bug_contact_empty",
    title: "[버그 탐지] 빈 문의 폼도 제출 성공",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "제목·내용 없이 보내도 성공 처리되는 결함을 재현합니다.",
    description: "문의 필드가 비어 있어도 제출이 성공 처리되는지 확인하고 제보를 작성합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact"], bugAcceptEmptyContact: true, entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "contact_empty_submit_bug", text: "빈 문의 제출이 성공 처리되는 버그를 확인한다." }
    ]
  },
  {
    id: "m_apply",
    title: "지금 신청하기 · 신청서",
    difficulty: "입문",
    type: "success",
    points: 80,
    summary: "신청 화면에서 이름·이메일·요청 사항을 입력하고 신청을 완료합니다.",
    description: "지금 신청하기 화면으로 이동해 신청 폼을 정상적으로 제출합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "apply"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "visited_apply", text: "신청 화면으로 이동한다." },
      { id: "o2", checkId: "submitted_apply_form", text: "신청 폼을 제출한다." }
    ]
  },
  {
    id: "m_dual_forms",
    title: "문의 + 신청 한 세션에 제출",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "같은 미션 안에서 문의 폼과 신청 폼을 모두 제출합니다.",
    description: "문의하기 제출 후 지금 신청하기 제출까지 한 세션에서 완료합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact", "apply"], entryRoute: "contact", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "submitted_contact_form", text: "문의 폼을 제출한다." },
      { id: "o2", checkId: "submitted_apply_form", text: "신청 폼을 제출한다." }
    ]
  },
  {
    id: "m_bug_apply_empty",
    title: "[버그 탐지] 빈 신청 폼도 제출 성공",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "이름·이메일 없이 신청해도 접수되는 결함을 재현합니다.",
    description: "신청 폼 필드를 비우고 제출해 성공 처리되는지 확인합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "apply"], bugAcceptEmptyApply: true, entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "apply_empty_submit_bug", text: "빈 신청 제출이 성공 처리되는 버그를 확인한다." }
    ]
  },
  {
    id: "m_plans",
    title: "구매 플랜 조회",
    difficulty: "입문",
    type: "success",
    points: 70,
    summary: "Starter / Pro / Team 플랜 비교 화면을 엽니다.",
    description: "구매 플랜 조회 화면으로 이동해 카드가 표시되는지 확인합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "plans"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "visited_plans", text: "플랜 비교 화면에 진입한다." }]
  },
  {
    id: "m_bug_nav",
    title: "[버그 탐지] 상단 메뉴와 화면 불일치",
    difficulty: "초급",
    type: "bug_hunt",
    points: 120,
    summary: "같은 이름의 메뉴가 서로 다른 결과를 내는지 찾습니다.",
    description: "상단 구매 플랜과 랜딩 맨 위 배너의 플랜 버튼 이동 결과를 비교합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact", "plans"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "wrong_plan_nav", text: "상단 구매 플랜 클릭 시 잘못된 화면 이동을 확인한다." },
      { id: "o2", checkId: "visited_plans", text: "랜딩 상단 배너의 플랜 버튼으로 올바른 화면에 진입한다." }
    ],
    challenge: {
      title: "불일치 재현 챌린지(미리보기)",
      timeLimitSec: 180,
      scoreMax: 150,
      winConditions: ["잘못된 내비 경로를 한 번 재현한다.", "올바른 플랜 진입 경로를 한 번 밟는다.", "이어지는 결함 제보 미션에서 정리한다(별도 미션)."],
      penaltyNotes: ["한쪽 경로만 확인하고 끝내면 감점(예정) — 현재는 표시만"],
      staticNote: "조건·타이머는 카탈로그 스키마 예시입니다. 클리어 판정은 기존 목표(check)만 사용합니다."
    }
  },
  {
    id: "m_bug_hero_plans_wrong",
    title: "[버그 탐지] 랜딩 배너 플랜 버튼 오연결",
    difficulty: "초급",
    type: "bug_hunt",
    points: 95,
    summary: "홈 맨 위 배너의 플랜 버튼이 잘못된 화면으로 연결되는지 확인합니다.",
    description: "랜딩 맨 위 배너의 플랜 버튼이 문의하기로 이동하는 결함을 재현합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact", "plans"], bugHeroPlansToContact: true, entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "wrong_hero_plans_nav", text: "랜딩 배너 플랜 버튼 오연결을 확인한다." }]
  },
  {
    id: "m_bug_hero_apply_wrong",
    title: "[버그 탐지] 랜딩 배너 신청 버튼 오연결",
    difficulty: "초급",
    type: "bug_hunt",
    points: 95,
    summary: "지금 신청하기가 플랜 화면으로 잘못 연결되는지 확인합니다.",
    description: "랜딩 맨 위 배너의 지금 신청하기가 플랜 화면으로 이동하는 결함을 재현합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "apply", "plans"], bugHeroApplyToPlans: true, entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "wrong_hero_apply_nav", text: "랜딩 배너 신청 버튼 오연결을 확인한다." }]
  },
  {
    id: "m_signup",
    title: "회원가입만 하기 (로그인 금지)",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "이 미션에서는 가입만 수행합니다.",
    description: "이름, 유효한 이메일, 비밀번호 8자 이상으로 회원가입을 완료합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "signup", "contact", "apply", "plans"], entryRoute: "signup", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "visited_signup", text: "회원가입 화면으로 이동한다." },
      { id: "o2", checkId: "signup_completed_valid", text: "올바른 정보로 가입을 완료한다." }
    ]
  },
  {
    id: "m_bug_signup",
    title: "[버그 탐지] 잘못된 이메일인데 성공 메시지",
    difficulty: "초급",
    type: "bug_hunt",
    points: 130,
    summary: "@ 없는 이메일인데 성공 메시지가 뜨는 결함을 재현합니다.",
    description: "회원가입 폼에 잘못된 이메일을 입력해도 성공 처리되는지 확인합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "signup"], entryRoute: "signup", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "signup_invalid_bug", text: "@ 없는 이메일 성공 처리 버그를 확인한다." }]
  },
  {
    id: "m_signup_password_rule",
    title: "회원가입 · 비밀번호 규칙 후 정상 가입",
    difficulty: "초급",
    type: "success",
    points: 115,
    summary: "짧은 비밀번호 거절을 확인한 뒤 정상 가입을 완료합니다.",
    description: "비밀번호 규칙 위반 제출을 먼저 확인하고 8자 이상으로 다시 가입합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "signup"], entryRoute: "signup", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "signup_rejected_short_password", text: "짧은 비밀번호 제출이 거절됨을 확인한다." },
      { id: "o2", checkId: "signup_completed_valid", text: "규칙을 만족하는 정보로 가입을 완료한다." }
    ]
  },
  {
    id: "m_bug_cta",
    title: "[버그 탐지] 체험하기 버튼 한 번에 안 넘어감",
    difficulty: "입문",
    type: "bug_hunt",
    points: 90,
    summary: "체험하기 버튼이 첫 클릭에서 경고만 띄우는 현상을 확인합니다.",
    description: "랜딩 맨 위 배너의 체험하기 버튼 첫 클릭 동작을 재현합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "signup", "login"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [{ id: "o1", checkId: "flaky_cta_observed", text: "체험하기 첫 클릭 경고 동작을 확인한다." }]
  },
  {
    id: "m_login",
    title: "로그인하기",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "가입 정보(또는 데모 계정)로 로그인합니다.",
    description: "로그인 화면에서 유효한 계정으로 로그인 성공을 확인합니다.",
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      entryRoute: "login",
      headerProfile: "guest_nav",
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [{ id: "o1", checkId: "login_completed", text: "로그인에 성공한다." }]
  },
  {
    id: "m_login_retry",
    title: "로그인 · 실패 한 번 후 성공",
    difficulty: "초급",
    type: "success",
    points: 110,
    summary: "잘못된 비밀번호 실패 후 올바른 정보로 로그인 성공을 확인합니다.",
    description: "로그인 실패 메시지를 확인한 뒤 재시도 성공까지 수행합니다.",
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      entryRoute: "login",
      headerProfile: "guest_nav",
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [
      { id: "o1", checkId: "login_failed_once", text: "로그인 실패를 최소 한 번 확인한다." },
      { id: "o2", checkId: "login_completed", text: "로그인에 성공한다." }
    ]
  },
  {
    id: "m_session_logout",
    title: "로그인 후 로그아웃",
    difficulty: "입문",
    type: "success",
    points: 95,
    summary: "로그인 이후 로그아웃이 정상 수행되는지 확인합니다.",
    description: "로그인 완료 후 상단 로그아웃 버튼으로 세션 종료를 확인합니다.",
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      entryRoute: "login",
      headerProfile: "guest_nav",
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [
      { id: "o1", checkId: "session_had_login", text: "로그인에 성공한다." },
      { id: "o2", checkId: "logout_done", text: "로그아웃을 실행한다." }
    ]
  },
  {
    id: "m_bug_login_false_success",
    title: "[버그 탐지] 로그인 실패인데 성공 토스트",
    difficulty: "초급",
    type: "bug_hunt",
    points: 105,
    summary: "실패 상황에서 성공 메시지가 뜨는 결함을 재현합니다.",
    description: "틀린 비밀번호를 넣어도 성공 토스트가 표시되는지 확인합니다.",
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      entryRoute: "login",
      headerProfile: "guest_nav",
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" },
      bugLoginFalseSuccess: true
    },
    objectives: [{ id: "o1", checkId: "login_false_success_bug", text: "실패 상황 성공 토스트 버그를 확인한다." }]
  },
  {
    id: "m_tour_public",
    title: "공개 화면 한 바퀴 (랜딩 배너)",
    difficulty: "입문",
    type: "success",
    points: 90,
    summary: "홈 맨 위 배너 버튼으로 문의·신청·플랜 화면을 모두 순회합니다.",
    description: "랜딩 맨 위 큰 버튼 줄(문의·신청·플랜)을 사용해 주요 공개 화면 3개를 확인합니다.",
    prerequisites: [],
    sandbox: { reset: true, allowedRoutes: ["landing", "contact", "apply", "plans"], entryRoute: "landing", headerProfile: "guest_nav" },
    objectives: [
      { id: "o1", checkId: "visited_contact", text: "문의하기 화면에 진입한다." },
      { id: "o2", checkId: "visited_apply", text: "신청 화면에 진입한다." },
      { id: "o3", checkId: "visited_plans", text: "플랜 비교 화면에 진입한다." }
    ]
  }
];

const missionFeatureGroups = [
  {
    hubMissionId: "m_inquiry",
    title: "문의하기 기능",
    summary: "문의 폼의 정상 제출, 반복 제출, 빈값 허용 결함 재현 시나리오입니다.",
    intro: "동일한 문의 UI로 성공/실패 관점을 나눠 연습합니다.",
    missionIds: ["m_inquiry", "m_repeat_inquiry", "m_bug_contact_empty"]
  },
  {
    hubMissionId: "m_apply",
    title: "신청하기 기능",
    summary: "신청 폼 단독 제출과 문의+신청 연계, 빈값 결함 시나리오를 다룹니다.",
    intro: "신청 폼의 정상 흐름과 결함 재현을 함께 학습합니다.",
    missionIds: ["m_apply", "m_dual_forms", "m_bug_apply_empty"]
  },
  {
    hubMissionId: "m_plans",
    title: "플랜·네비게이션",
    summary: "플랜 조회 성공 시나리오와 랜딩 배너·상단 메뉴 결함 시나리오입니다.",
    intro: "같은 목적 버튼이 다른 결과로 연결되는 결함을 중점 확인합니다.",
    missionIds: ["m_plans", "m_bug_nav", "m_bug_hero_plans_wrong", "m_bug_hero_apply_wrong"]
  },
  {
    hubMissionId: "m_signup",
    title: "회원가입 기능",
    summary: "정상 가입, 이메일/비밀번호 검증, CTA 결함 시나리오입니다.",
    intro: "회원가입 폼과 랜딩 CTA 동작을 함께 검증합니다.",
    missionIds: ["m_signup", "m_bug_signup", "m_signup_password_rule", "m_bug_cta"]
  },
  {
    hubMissionId: "m_login",
    title: "로그인·세션",
    summary: "로그인 성공/재시도/로그아웃과 실패-성공 토스트 결함을 검증합니다.",
    intro: "세션 흐름 및 인증 메시지의 신뢰성을 점검합니다.",
    missionIds: ["m_login", "m_login_retry", "m_session_logout", "m_bug_login_false_success"]
  },
  {
    hubMissionId: "m_tour_public",
    title: "공개 화면 탐색",
    summary: "비로그인 상태에서 주요 CTA로 공개 화면을 순회하는 시나리오입니다.",
    intro: "초기 사용자 관점에서 주요 기능 진입 경로를 빠르게 확인합니다.",
    missionIds: ["m_tour_public"]
  }
];

function buildGeneratedMissionFromDraft(draft) {
  const m = draft?.missionDraft;
  const runtime = m?.runtimeMission;
  if (!m || !runtime || !runtime.route || !runtime.visitCheckId || !runtime.submitCheckId) return null;
  const safeId = String(m.missionId || "").trim();
  if (!safeId) return null;
  const route = runtime.route;
  const routeLabelMap = {
    contact: "문의하기",
    apply: "신청하기",
    signup: "회원가입",
    login: "로그인",
    plans: "플랜 조회"
  };
  const routeLabel = routeLabelMap[route] || route;
  return {
    id: safeId,
    title: `[생성] ${m.title || "자동 생성 시나리오"}`,
    difficulty: m.difficulty || "중급",
    type: "success",
    points: 120,
    summary: `${routeLabel} 기반 관리자 생성 시나리오`,
    description: `관리자 라벨링에서 생성된 시나리오입니다.\n대상 URL: ${m.sourceUrl || draft?.targetUrl || "unknown"}`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", route],
      entryRoute: "landing",
      headerProfile: "guest_nav"
    },
    objectives: [
      { id: "o1", checkId: runtime.visitCheckId, text: `${routeLabel} 화면에 진입한다.` },
      { id: "o2", checkId: runtime.submitCheckId, text: `${routeLabel} 핵심 동작(제출/완료)을 수행한다.` }
    ],
    generatedMeta: {
      scenarioId: draft.id,
      hiddenObjectivePolicy: m.hiddenObjectivePolicy || "none"
    }
  };
}

function appendGeneratedMissionsFromDrafts() {
  const loader = window.QA && typeof window.QA.loadScenarioDrafts === "function" ? window.QA.loadScenarioDrafts : null;
  if (!loader) return;
  const drafts = loader();
  if (!Array.isArray(drafts) || drafts.length === 0) return;
  const generated = drafts.map(buildGeneratedMissionFromDraft).filter(Boolean);
  if (!generated.length) return;

  const existingIds = new Set(missions.map((m) => m.id));
  const appendedIds = [];
  generated.forEach((gm) => {
    if (existingIds.has(gm.id)) return;
    missions.push(gm);
    existingIds.add(gm.id);
    appendedIds.push(gm.id);
  });
  if (!appendedIds.length) return;

  missionFeatureGroups.push({
    hubMissionId: appendedIds[0],
    title: "관리자 생성 시나리오",
    summary: "관리자 라벨링에서 생성된 동적 미션입니다.",
    intro: "관리자 화면에서 생성된 미션이 이 묶음에 자동 반영됩니다.",
    missionIds: appendedIds
  });
}

appendGeneratedMissionsFromDrafts();

(function applyMissionCatalogMeta() {
  const QA = window.QA;
  if (!QA || typeof QA.enrichMissionCatalog !== "function") {
    throw new Error("[missions-seo] mission-catalog-enrich.js를 missions-seo.js보다 먼저 로드하세요.");
  }
  QA.enrichMissionCatalog(missions);
  QA.validateMissionCatalog(missions, "missions-seo");
})();

function getMissionById(id) {
  return missions.find((m) => m.id === id) || null;
}

function isMissionUnlocked(mission, completedIds) {
  if (!mission.prerequisites?.length) return true;
  return mission.prerequisites.every((req) => completedIds.includes(req));
}

function firstIncompletePrerequisiteId(mission, completedIds) {
  if (!mission?.prerequisites?.length) return null;
  const done = completedIds || [];
  for (const id of mission.prerequisites) {
    if (!done.includes(id)) return id;
  }
  return null;
}

function getFeatureGroupByHubId(hubMissionId) {
  return missionFeatureGroups.find((g) => g.hubMissionId === hubMissionId) || null;
}

function getGroupedMissionIdsSet() {
  const set = new Set();
  missionFeatureGroups.forEach((g) => g.missionIds.forEach((id) => set.add(id)));
  return set;
}

(function validateMissionFeatureGroups() {
  const allIds = new Set(missions.map((m) => m.id));
  const covered = new Set();
  for (const g of missionFeatureGroups) {
    if (!allIds.has(g.hubMissionId)) {
      throw new Error(`[missions-seo] hubMissionId가 정의되지 않은 미션입니다: ${g.hubMissionId}`);
    }
    if (!g.missionIds.includes(g.hubMissionId)) {
      throw new Error(`[missions-seo] hubMissionId는 해당 묶음 missionIds에 포함되어야 합니다: ${g.hubMissionId}`);
    }
    for (const id of g.missionIds) {
      if (!allIds.has(id)) throw new Error(`[missions-seo] 기능 묶음에 없는 mission id: ${id}`);
      if (covered.has(id)) throw new Error(`[missions-seo] 미션이 두 묶음에 중복되었습니다: ${id}`);
      covered.add(id);
    }
  }
  const missing = missions.map((m) => m.id).filter((id) => !covered.has(id));
  if (missing.length) {
    throw new Error(`[missions-seo] 기능 묶음에 빠진 미션: ${missing.join(", ")}`);
  }
})();

window.QA = window.QA || {};
window.QA.missions = missions;
window.QA.missionFeatureGroups = missionFeatureGroups;
window.QA.getMissionById = getMissionById;
window.QA.isMissionUnlocked = isMissionUnlocked;
window.QA.firstIncompletePrerequisiteId = firstIncompletePrerequisiteId;
window.QA.getFeatureGroupByHubId = getFeatureGroupByHubId;
window.QA.getGroupedMissionIdsSet = getGroupedMissionIdsSet;
window.QA.activeCatalog = {
  id: "seo-demo-phase1",
  sourceUrl: "",
  sourceType: "static-sandbox"
};

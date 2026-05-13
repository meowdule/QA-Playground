window.QA = window.QA || {};

const STORAGE_KEY = "qa_playground_app_v4";
const REPORTS_KEY = "qa_playground_reports_v3";
const ADMIN_SESSION_KEY = "qa_playground_admin_session_v1";
const SCENARIO_DRAFTS_KEY = "qa_playground_scenario_drafts_v1";
const ADMIN_ACCOUNT = {
  email: "admin@qa.playground",
  password: "admin1234!",
  displayName: "관리자"
};

/** GitHub Pages 등 공개 데모용 고정 일반 계정(클라이언트 전용, 비밀 아님) */
const DEMO_USER_ACCOUNT = {
  email: "demo@qa.playground",
  password: "demo1234!",
  displayName: "데모 사용자"
};

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function defaultProgress() {
  return {
    completedMissionIds: [],
    lastSignupEmail: null,
    lastSignupName: null
  };
}

/** @returns {{ users: Record<string, { displayName: string, password: string, createdAt: number }>, sessionEmail: string | null, progress: Record<string, ReturnType<typeof defaultProgress>> }} */
function loadAppData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      users: {},
      sessionEmail: null,
      progress: {}
    };
  }
  const data = safeParse(raw, { users: {}, sessionEmail: null, progress: {} });
  return {
    users: data.users || {},
    sessionEmail: data.sessionEmail || null,
    progress: data.progress || {}
  };
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function registerUser(email, password, displayName) {
  const e = normalizeEmail(email);
  if (!e.includes("@")) {
    throw new Error("이메일 형식을 확인해 주세요.");
  }
  if (String(password || "").length < 6) {
    throw new Error("비밀번호는 6자 이상이어야 합니다.");
  }
  const name = String(displayName || "").trim();
  if (!name) {
    throw new Error("표시 이름(닉네임)을 입력해 주세요.");
  }
  const data = loadAppData();
  if (e === ADMIN_ACCOUNT.email || e === DEMO_USER_ACCOUNT.email) {
    throw new Error("이 이메일은 데모 전용입니다. 로그인 화면의 안내를 참고해 주세요.");
  }
  if (data.users[e]) {
    throw new Error("이미 가입된 이메일입니다. 로그인해 주세요.");
  }
  data.users[e] = { displayName: name, password: String(password), createdAt: Date.now() };
  data.progress[e] = data.progress[e] || defaultProgress();
  data.sessionEmail = e;
  saveAppData(data);
  return { email: e, displayName: name };
}

function loginUser(email, password) {
  const e = normalizeEmail(email);
  if (e === ADMIN_ACCOUNT.email && String(password || "") === ADMIN_ACCOUNT.password) {
    loginAdmin(e, password);
    const adminData = loadAppData();
    adminData.sessionEmail = ADMIN_ACCOUNT.email;
    saveAppData(adminData);
    return { email: ADMIN_ACCOUNT.email, displayName: ADMIN_ACCOUNT.displayName };
  }
  if (e === DEMO_USER_ACCOUNT.email && String(password || "") === DEMO_USER_ACCOUNT.password) {
    logoutAdmin();
    const data = loadAppData();
    data.users[e] = {
      displayName: DEMO_USER_ACCOUNT.displayName,
      password: DEMO_USER_ACCOUNT.password,
      createdAt: data.users[e]?.createdAt || Date.now()
    };
    data.progress[e] = data.progress[e] || defaultProgress();
    data.sessionEmail = e;
    saveAppData(data);
    return { email: e, displayName: DEMO_USER_ACCOUNT.displayName };
  }
  const data = loadAppData();
  const u = data.users[e];
  if (!u || u.password !== String(password)) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  data.sessionEmail = e;
  saveAppData(data);
  return { email: e, displayName: u.displayName };
}

function logoutUser() {
  const data = loadAppData();
  data.sessionEmail = null;
  saveAppData(data);
  logoutAdmin();
}

function updateUserDisplayName(email, displayName) {
  const e = normalizeEmail(email);
  const name = String(displayName || "").trim();
  if (!name) {
    throw new Error("표시 이름을 입력해 주세요.");
  }
  const data = loadAppData();
  if (!data.users[e]) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }
  data.users[e].displayName = name;
  saveAppData(data);
  return { email: e, displayName: name };
}

/** @returns {{ email: string, displayName: string } | null} */
function getSessionUser() {
  const data = loadAppData();
  const e = data.sessionEmail;
  if (e === ADMIN_ACCOUNT.email && isAdminLoggedIn()) {
    return { email: ADMIN_ACCOUNT.email, displayName: ADMIN_ACCOUNT.displayName };
  }
  if (!e || !data.users[e]) return null;
  return { email: e, displayName: data.users[e].displayName };
}

/** 진행도 저장 키(로그인한 사용자 이메일). 비로그인이면 null */
function getProgressUserKey() {
  const u = getSessionUser();
  return u ? u.email : null;
}

function getProgress(userKey) {
  const data = loadAppData();
  if (!userKey) return defaultProgress();
  return { ...defaultProgress(), ...(data.progress[userKey] || {}) };
}

function markMissionComplete(userKey, missionId) {
  if (!userKey) return;
  const data = loadAppData();
  const p = getProgress(userKey);
  if (!p.completedMissionIds.includes(missionId)) {
    p.completedMissionIds.push(missionId);
  }
  data.progress[userKey] = p;
  saveAppData(data);
}

function saveSignupIdentity(userKey, email, name) {
  if (!userKey) return;
  const data = loadAppData();
  const p = getProgress(userKey);
  p.lastSignupEmail = email;
  p.lastSignupName = name;
  data.progress[userKey] = p;
  saveAppData(data);
}

function loadReports() {
  return safeParse(localStorage.getItem(REPORTS_KEY), []);
}

function addReport(entry) {
  const list = loadReports();
  list.unshift({
    id: `r_${Date.now()}`,
    createdAt: Date.now(),
    ...entry
  });
  localStorage.setItem(REPORTS_KEY, JSON.stringify(list.slice(0, 200)));
}

function loginAdmin(email, password) {
  const u = normalizeEmail(email);
  const p = String(password || "");
  if (u !== ADMIN_ACCOUNT.email || p !== ADMIN_ACCOUNT.password) {
    throw new Error("관리자 계정 정보가 올바르지 않습니다.");
  }
  const session = {
    email: ADMIN_ACCOUNT.email,
    displayName: ADMIN_ACCOUNT.displayName,
    loggedInAt: Date.now()
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
}

function getAdminSession() {
  return safeParse(localStorage.getItem(ADMIN_SESSION_KEY), null);
}

function isAdminLoggedIn() {
  const s = getAdminSession();
  return !!(s && s.email === ADMIN_ACCOUNT.email);
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function loadScenarioDrafts() {
  return safeParse(localStorage.getItem(SCENARIO_DRAFTS_KEY), []);
}

function saveScenarioDrafts(drafts) {
  localStorage.setItem(SCENARIO_DRAFTS_KEY, JSON.stringify(Array.isArray(drafts) ? drafts : []));
}

Object.assign(window.QA, {
  loadAppData,
  saveAppData,
  registerUser,
  loginUser,
  logoutUser,
  updateUserDisplayName,
  getSessionUser,
  getProgressUserKey,
  getProgress,
  markMissionComplete,
  saveSignupIdentity,
  loadReports,
  addReport,
  loginAdmin,
  getAdminSession,
  isAdminLoggedIn,
  logoutAdmin,
  loadScenarioDrafts,
  saveScenarioDrafts,
  ADMIN_ACCOUNT,
  DEMO_USER_ACCOUNT
});


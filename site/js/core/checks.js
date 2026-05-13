/**
 * 미션 목표 판정 — 주로 sandbox.getSnapshot(); 일부 checkId는 extra(미션 id·사용자)로 로컬 제보를 조회합니다.
 */
function reportMatches(missionId, scope, userEmail) {
  const QA = window.QA;
  if (!missionId || !QA || typeof QA.loadReports !== "function") return false;
  const list = QA.loadReports();
  if (!Array.isArray(list)) return false;
  return list.some((r) => {
    if (r.missionId !== missionId || r.scope !== scope) return false;
    const u = userEmail == null || userEmail === "" ? null : userEmail;
    const ru = r.userEmail == null || r.userEmail === "" ? null : r.userEmail;
    return u === ru;
  });
}

function tcPracticeMessageMeetsMin(missionId, userEmail, minLen) {
  const QA = window.QA;
  if (!missionId || !QA || typeof QA.loadReports !== "function") return false;
  const list = QA.loadReports();
  if (!Array.isArray(list)) return false;
  const u = userEmail == null || userEmail === "" ? null : userEmail;
  const r = list.find((x) => {
    if (x.missionId !== missionId || x.scope !== "tc_practice") return false;
    const ru = x.userEmail == null || x.userEmail === "" ? null : x.userEmail;
    return ru === u;
  });
  if (!r) return false;
  const len = String(r.message || "")
    .replace(/\s+/g, " ")
    .trim().length;
  return len >= (minLen || 100);
}

const checks = {
  visited_contact: (s) => s.visited.includes("contact"),
  submitted_contact_form: (s) => s.contactFormSubmitted,
  visited_apply: (s) => s.visited.includes("apply"),
  submitted_apply_form: (s) => s.applyFormSubmitted,
  visited_plans: (s) => s.visited.includes("plans"),
  wrong_plan_nav: (s) => s.wrongPlanNavObserved,
  visited_signup: (s) => s.visited.includes("signup"),
  signup_completed_valid: (s) => s.signupCompletedValid,
  signup_invalid_bug: (s) => s.signupInvalidBugReproduced,
  flaky_cta_observed: (s) => s.flakyCtaObserved,
  login_completed: (s) => s.loginCompleted,
  post_created: (s) => s.postCreated,
  post_edited: (s) => s.postEdited,
  post_deleted: (s) => s.postDeleted,
  comment_added: (s) => s.commentAdded,
  comment_edited: (s) => s.commentEdited,
  comment_deleted: (s) => s.commentDeleted,
  profile_updated: (s) => s.profileUpdated,
  visited_board: (s) => s.visited.includes("board"),
  visited_login: (s) => s.visited.includes("login"),
  visited_post: (s) => s.visited.includes("post"),
  contact_submit_twice: (s) => (s.contactSubmitCount || 0) >= 2,
  apply_submit_twice: (s) => (s.applySubmitCount || 0) >= 2,
  login_failed_once: (s) => (s.loginFailureCount || 0) >= 1,
  session_had_login: (s) => s.sessionHadLoginSuccess === true,
  logout_done: (s) => s.logoutPerformed === true,
  signup_rejected_short_password: (s) => s.signupWeakPasswordRejected === true,
  contact_empty_submit_bug: (s) => s.contactEmptySubmitBugReproduced === true,
  apply_empty_submit_bug: (s) => s.applyEmptySubmitBugReproduced === true,
  wrong_hero_apply_nav: (s) => s.wrongHeroApplyNavObserved === true,
  wrong_hero_plans_nav: (s) => s.wrongHeroPlansNavObserved === true,
  login_false_success_bug: (s) => s.loginFalseSuccessBugReproduced === true,
  board_empty_while_posts_bug: (s) => s.boardEmptyWhileHasPostsBugObserved === true,
  wrong_author_on_post_bug: (s) => s.wrongAuthorOnPostBugObserved === true,
  comment_double_submit_bug: (s) => s.commentDoubleSubmitBugReproduced === true,
  profile_fake_save_bug: (s) => s.profileFakeSaveBugReproduced === true,
  /** 제보 도우미(reportForm) 로컬 저장 — play에서 missionId·userEmail 전달 */
  submitted_tutorial_feedback_report: (s, extra) =>
    reportMatches(extra?.missionId, "tutorial_feedback", extra?.userEmail ?? null),
  /** 우하단 ? 사이트 문의 저장 */
  submitted_site_inquiry: (s, extra) => reportMatches(extra?.missionId, "site_inquiry", extra?.userEmail ?? null),
  /** 플레이 내장 Postman 패널에서 목록 GET (모의) */
  api_lab_postman_list_sent: (s) => s.apiLab?.postmanListSent === true,
  /** 플레이 내장 Postman 패널에서 chapter 쿼리 포함 목록 GET */
  api_lab_postman_filtered_sent: (s) => s.apiLab?.postmanFilteredSent === true,
  /** 플레이 내장 Postman 패널에서 단건 GET (모의) */
  api_lab_postman_detail_sent: (s) => s.apiLab?.postmanDetailSent === true,
  /** 플레이 내장 Postman 패널에서 문의 목록 GET */
  api_lab_postman_inquiries_sent: (s) => s.apiLab?.postmanInquiriesSent === true,
  /** 플레이 내장 Swagger 패널에서 목록 Execute */
  api_lab_swagger_list_try: (s) => s.apiLab?.swaggerListTry === true,
  /** 플레이 내장 Swagger 패널에서 필터 쿼리 목록 Execute */
  api_lab_swagger_filtered_try: (s) => s.apiLab?.swaggerFilteredTry === true,
  /** 플레이 내장 Swagger 패널에서 단건 Execute */
  api_lab_swagger_detail_try: (s) => s.apiLab?.swaggerDetailTry === true,
  /** 플레이 내장 Swagger 패널에서 문의 목록 Execute */
  api_lab_swagger_inquiries_try: (s) => s.apiLab?.swaggerInquiriesTry === true,
  /** TC 작성 실습 — 플레이 패널에서 tc_practice 스코프로 저장, 본문 최소 길이 */
  tc_practice_saved: (s, extra) => tcPracticeMessageMeetsMin(extra?.missionId, extra?.userEmail ?? null, 100)
};

function evaluateCheck(checkId, snapshot, extra) {
  const fn = checks[checkId];
  if (!fn) return false;
  return fn(snapshot, extra);
}

function listCheckIds() {
  return Object.keys(checks);
}

window.QA = window.QA || {};
window.QA.evaluateCheck = evaluateCheck;
window.QA.listCheckIds = listCheckIds;


/**
 * 미션 목표 판정 — sandbox.getSnapshot() 결과만 사용 (유지보수: 체크 ID 추가)
 */
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
  profile_fake_save_bug: (s) => s.profileFakeSaveBugReproduced === true
};

function evaluateCheck(checkId, snapshot) {
  const fn = checks[checkId];
  if (!fn) return false;
  return fn(snapshot);
}

function listCheckIds() {
  return Object.keys(checks);
}

window.QA = window.QA || {};
window.QA.evaluateCheck = evaluateCheck;
window.QA.listCheckIds = listCheckIds;


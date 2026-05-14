/**
 * 학습자 앱(SPA) 해시 경로. play.html 등 레거시 페이지에서도 동일 규칙으로 링크합니다.
 * — index.html#/… 만 사용 (상대 ./index.html 기준)
 */
(function (global) {
  const QA = (global.QA = global.QA || {});
  QA.learnerHref = {
    home() {
      return "./index.html#/";
    },
    learn() {
      return "./index.html#/learn";
    },
    board() {
      return "./index.html#/board";
    },
    tcLab() {
      return "./index.html#/tc-lab";
    },
    challenges() {
      return "./index.html#/challenges";
    },
    mission(missionId, opts) {
      const q = new URLSearchParams({ m: missionId });
      if (opts && opts.detail) q.set("d", "1");
      return `./index.html#/mission?${q}`;
    },
    login(next) {
      const q =
        next && next !== "index.html" && next !== "./index.html"
          ? `?next=${encodeURIComponent(next)}`
          : "";
      return `./index.html#/login${q}`;
    },
    signup(next) {
      const q =
        next && next !== "index.html" && next !== "./index.html"
          ? `?next=${encodeURIComponent(next)}`
          : "";
      return `./index.html#/signup${q}`;
    },
    account(returnPath) {
      const q = returnPath ? `?next=${encodeURIComponent(returnPath)}` : "";
      return `./index.html#/account${q}`;
    }
  };

  /** SPA 또는 구 URL 쿼리에서 앱 파라미터 읽기 */
  QA.learnerAppSearchParams = function learnerAppSearchParams() {
    const raw = String(global.location.hash || "").replace(/^#/, "");
    const qi = raw.indexOf("?");
    if (qi >= 0) return new URLSearchParams(raw.slice(qi + 1));
    return new URLSearchParams(global.location.search);
  };
})(typeof window !== "undefined" ? window : globalThis);

/**
 * 해시 라우터: #/path?query
 */
export function parseLearnerRoute() {
  const raw = String(window.location.hash || "").replace(/^#/, "").trim() || "/";
  const qi = raw.indexOf("?");
  const path = (qi >= 0 ? raw.slice(0, qi) : raw).replace(/^\/+/, "/");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const query = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : "");
  return { path: normalized, query };
}

export function setLearnerHash(path, queryObj) {
  const q =
    queryObj && typeof queryObj === "object"
      ? new URLSearchParams(
          Object.entries(queryObj).filter(([, v]) => v != null && v !== "")
        ).toString()
      : "";
  const tail = q ? `?${q}` : "";
  window.location.hash = `#${path.startsWith("/") ? path : `/${path}`}${tail}`;
}

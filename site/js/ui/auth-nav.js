function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function initials(displayName) {
  const t = String(displayName || "").trim();
  if (!t) return "?";
  const arr = t.split(/\s+/).filter(Boolean);
  if (arr.length >= 2) return (arr[0][0] + arr[1][0]).slice(0, 2).toUpperCase();
  return t.slice(0, 2).toUpperCase();
}

/**
 * @param {HTMLElement | null} el
 * @param {{ next?: string, returnPath?: string }} [opts]
 * - returnPath: 정보 수정 후 돌아올 경로 (예: ./index.html#/mission?m=x)
 */
function mountAuthNav(el, opts = {}) {
  if (!el) return;
  const QA = window.QA;
  const user = QA.getSessionUser();
  if (user) {
    const isAdmin = typeof QA.isAdminLoggedIn === "function" && QA.isAdminLoggedIn() && user.email === QA.ADMIN_ACCOUNT?.email;
    const ini = esc(initials(user.displayName));
    const avatarUrl = typeof QA.getProfileAvatarUrl === "function" ? QA.getProfileAvatarUrl(user) : "";
    el.innerHTML = `
      <div class="site-user-menu">
        <button type="button" class="site-user-trigger" id="siteUserTrigger" aria-expanded="false" aria-haspopup="true">
          <span class="site-user-avatar" aria-hidden="true">
            ${
              avatarUrl
                ? `<img class="site-user-avatar-img" src="${avatarUrl}" alt="${esc(user.displayName)} 프로필" loading="lazy" onerror="this.remove();this.nextElementSibling.style.display='grid';" />`
                : ""
            }
            <span class="site-user-avatar-fallback">${ini}</span>
          </span>
          <span class="site-user-name">${esc(user.displayName)}</span>
          <span class="site-user-caret" aria-hidden="true">▾</span>
        </button>
        <div class="site-user-dropdown" id="siteUserDropdown" hidden role="menu">
          <p class="site-user-dropdown-email">${esc(user.email)}</p>
          <a role="menuitem" class="site-dropdown-link" href="${QA.learnerHref.account(opts.returnPath)}">정보 수정</a>
          ${isAdmin ? '<a role="menuitem" class="site-dropdown-link" href="./admin-missions.html">관리</a>' : ""}
          <button type="button" role="menuitem" class="site-dropdown-logout" id="siteNavLogout">로그아웃</button>
        </div>
      </div>
    `;
    const trigger = el.querySelector("#siteUserTrigger");
    const dropdown = el.querySelector("#siteUserDropdown");
    const menu = el.querySelector(".site-user-menu");
    const close = () => {
      if (!dropdown.hidden) {
        dropdown.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }
    };
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = dropdown.hidden;
      dropdown.hidden = !open;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", close);
    el.querySelector("#siteNavLogout").addEventListener("click", () => {
      QA.logoutUser();
      window.location.href = QA.learnerHref.home();
    });
  } else {
    el.innerHTML = `
      <a class="site-nav-link site-nav-cta" href="${QA.learnerHref.login(opts.next)}">로그인</a>
    `;
  }
}

window.QA = window.QA || {};
window.QA.mountAuthNav = mountAuthNav;


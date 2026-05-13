/**
 * Deterministic profile avatar URL from nickname/email.
 * Uses DiceBear thumbs style for a clean neutral random avatar.
 */
(function () {
  function buildAvatarSeed(user) {
    const name = String(user?.displayName || "").trim().toLowerCase();
    const email = String(user?.email || "").trim().toLowerCase();
    return `${name}::${email}` || "guest";
  }

  function getProfileAvatarUrl(user) {
    const seed = buildAvatarSeed(user);
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f8f8f8,eae8e3,d6ded2`;
  }

  window.QA = window.QA || {};
  window.QA.getProfileAvatarUrl = getProfileAvatarUrl;
})();


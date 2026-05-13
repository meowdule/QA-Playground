/**
 * 챌린지 상세 페이지는 사용자 흐름에서 쓰지 않습니다.
 * 북마크·직접 URL 진입 시 확인 후 플레이로 보냅니다.
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const missionId = params.get("m");
  if (!missionId) {
    window.location.replace("./index.html#/challenges");
    return;
  }
  const go = window.confirm(
    "테스트(플레이) 화면으로 이동할까요?\n\n챌린지 타이머·실점수는 아직 연결되어 있지 않습니다."
  );
  if (go) {
    window.location.replace(`./play.html?m=${encodeURIComponent(missionId)}&from=challenge`);
  } else {
    window.location.replace("./index.html#/challenges");
  }
})();

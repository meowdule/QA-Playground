/**
 * 챌린지 상세 페이지는 사용자 흐름에서 쓰지 않습니다.
 * 북마크·직접 URL 진입 시 확인 후 플레이로 보냅니다.
 */
(function () {
  const QA = window.QA;
  const params = new URLSearchParams(window.location.search);
  const missionId = params.get("m");

  function goPlay() {
    window.location.replace(`./play.html?m=${encodeURIComponent(missionId)}&from=challenge`);
  }
  function goBack() {
    window.location.replace("./index.html#/challenges");
  }

  if (!missionId) {
    goBack();
    return;
  }

  function ask() {
    if (typeof QA.openLearnerConfirm === "function") {
      return QA.openLearnerConfirm({
        title: "테스트 화면으로 이동",
        message:
          "플레이(테스트) 화면으로 이동합니다.\n\n타이머·실시간 채점은 아직 연결되어 있지 않으며, 연습용 데모만 열립니다.",
        confirmText: "이동",
        cancelText: "목록으로"
      });
    }
    return Promise.resolve(
      window.confirm(
        "테스트(플레이) 화면으로 이동할까요?\n\n챌린지 타이머·실점수는 아직 연결되어 있지 않습니다."
      )
    );
  }

  ask().then((ok) => {
    if (ok) goPlay();
    else goBack();
  });
})();

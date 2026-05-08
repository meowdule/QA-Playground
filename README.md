# QA Playground

GitHub Pages에 올려 두고 쓰기 좋은 **정적 QA 연습 사이트**입니다. **미션 카탈로그 → 상세 → 수행(플레이)** 흐름이며, UI는 밝은 **러닝 플랫폼(인프런/IT 스타일)** 과 플레이 화면 **다크 워크스페이스**로 나뉩니다.

## 계정

- **홈(`index.html`)**에는 미션 그리드만 두고, 회원가입/로그인 폼은 **별도 페이지**(`signup.html`, `login.html`)로 분리했습니다.
- **미션 상세(`mission.html`)**는 누구나 열 수 있고, **실제 수행(`play.html`)** 직전에만 로그인을 요구합니다.
- 진행도·점수는 로그인한 이메일 기준 `localStorage`에 저장됩니다.

## 구조

| 경로 | 설명 |
|------|------|
| [index.html](./index.html) | 전체 미션 그리드(카드 → 상세로 이동), 상단 로그인/가입 링크 |
| [mission.html?m=미션ID](./mission.html) | 미션 설명·목표 미리보기 · **미션 수행하기** (비로그인 시 안내만) |
| [login.html](./login.html) / [signup.html](./signup.html) | 로그인·회원가입 전용 (`?next=` 로 수행 화면 복귀) |
| [play.html?m=미션ID](./play.html) | 샌드박스 + 제보 (비로그인 시 `login.html?next=...`) |
| [js/missions.js](./js/missions.js) | **미션 정의만** 모음 — 새 미션은 여기에 객체 추가 |
| [js/core/checks.js](./js/core/checks.js) | 목표 달성 조건(`checkId`) 레지스트리 |
| [js/sandbox.js](./js/sandbox.js) | 테스트 대상 UI·상태·미션별 메뉴 제한 |
| [js/core/storage.js](./js/core/storage.js) | 프로필·진행도·제보(localStorage) |
| [js/ui](./js/ui) | 공통 UI 스크립트(헤더 인증, 선행 미션 모달, 아바타) |
| [js/pages](./js/pages) | 페이지별 엔트리 스크립트(home/play/login 등) |

레퍼런스 느낌의 원본: [SEO DEMO](https://meowdule.github.io/SEO-TESTING-HTML/)

## 미션별 기능 제한

각 미션은 `missions.js`의 `sandbox.allowedRoutes`로 **열리는 화면이 달라집니다.**

- 예: **회원가입** 미션에서는 로그인·게시판·프로필로 가는 메뉴가 비활성화됩니다.
- 예: **로그인** 미션에서는 가입 화면이 비활성화되어, “이미 계정이 있다”는 전제를 연습합니다.

## 제보 / DB

- **제보하기**는 브라우저 `localStorage`에만 쌓입니다. (정적 호스팅만으로 동작)
- 나중에 서버를 붙일 경우: `storage.js`의 `addReport` / `loadReports`를 API 호출로 바꾸면 됩니다.

## 미션 개수

기본 제공 **20개** 미션(성공 시나리오 + 버그 탐지 + 로그인/게시판/댓글/프로필 등)이 `js/missions.js`에 정의되어 있습니다.

## 새 미션 추가 방법

1. `js/core/checks.js`에 필요하면 새 `checkId`와 판정 함수를 추가합니다.
2. `js/missions.js` 배열에 새 객체를 추가합니다. (`id`, `title`, `sandbox.allowedRoutes`, `objectives[].checkId` 등)
3. 홈 그리드에 자동으로 나타납니다.

## 추후에 넣기 좋은 미션 아이디어

- **접근성**: 키보드만으로 폼 포커스 이동·제출
- **반응형**: 창 크기를 줄였을 때 CTA가 가려지는지
- **권한**: 다른 사용자 글에 수정 버튼이 보이면 안 되는 경우(데모 계정 두 개로 재현)
- **세션**: 로그인 후 “만료”를 가정한 메시지 처리

## 로컬 실행

`index.html`을 **파일로 직접 열어도**(`file:///...`) 동작합니다. (ES 모듈 대신 일반 스크립트 + `window.QA` 로딩)

원하면 `npx serve .` 등으로 로컬 서버를 띄워도 됩니다.

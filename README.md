# QA Playground

GitHub Pages에 올려 두고 쓰기 좋은 **정적 QA 연습 사이트**입니다.  
브라우저 내 **연습 데모(sandbox)**·미션 카탈로그·Postman/Swagger 스타일 API 랩·Playwright 생성 파이프라인을 포함합니다.

**배포되는 정적 사이트**는 저장소 루트가 아니라 [`site/`](./site/) 폴더입니다. (GitHub Actions가 `site`만 Pages 아티팩트로 올립니다.)

## 진행 단계

- Phase 1: 카탈로그 분리 (`site/js/missions-seo.js`)
- Phase 2: 관리자 대시보드 (`site/admin-missions.html` 등)
- Phase 3: 관리자 편집 고도화 (step/rule/variant CRUD)
- Phase 4: Playwright 생성/실행 파이프라인 + CI
- Phase 5: 교육생 UX (진행률/재시작/난이도 힌트/히든 목표)
- Phase 6: 운영 안정화(검증 스크립트/체크리스트/품질 게이트)

## 계정

- **홈(`site/index.html`)**은 해시 라우팅 SPA로 미션 그리드를 띄우고, 로그인·가입은 `#/login`·`#/signup`으로 분리되어 있습니다.
- **미션 상세**는 `#/mission?m=…`(허브·단일 시나리오), **실제 수행**은 `site/play.html`에서 진행하며 비로그인 시 로그인으로 안내됩니다.
- 진행도·점수는 로그인한 이메일 기준 `localStorage`에 저장됩니다.

## 구조

| 경로 | 설명 |
|------|------|
| [`site/index.html`](./site/index.html) | 학습자 앱 셸 + `js/spa/main.js` (홈·미션·TC 랩·챌린지·인증) |
| [`site/play.html`](./site/play.html) | 샌드박스 실습(테스트 화면) |
| [`site/js/missions.js`](./site/js/missions.js) | **미션 정의만** 모음 — 새 미션은 여기에 객체 추가 |
| [`site/js/core/checks.js`](./site/js/core/checks.js) | 목표 달성 조건(`checkId`) 레지스트리 |
| [`site/js/sandbox.js`](./site/js/sandbox.js) | 테스트 대상 UI·상태·미션별 메뉴 제한 |
| [`site/js/core/storage.js`](./site/js/core/storage.js) | 프로필·진행도·제보(localStorage) |
| [`site/js/ui`](./site/js/ui) | 공통 UI 스크립트(헤더 인증, 선행 미션 모달, 아바타) |
| [`site/js/pages`](./site/js/pages) | 페이지별 엔트리 스크립트(home/play/login 등) |
| [`data/scenarios.json`](./data/scenarios.json) | Playwright 시나리오 소스(빌드·CI용, 사이트 루트) |

## 미션별 기능 제한

각 미션은 `missions.js`의 `sandbox.allowedRoutes`로 **열리는 화면이 달라집니다.**

- 예: **회원가입** 미션에서는 로그인·게시판·프로필로 가는 메뉴가 비활성화됩니다.
- 예: **로그인** 미션에서는 가입 화면이 비활성화되어, “이미 계정이 있다”는 전제를 연습합니다.

## 제보 / DB

- **제보하기**는 브라우저 `localStorage`에만 쌓입니다. (정적 호스팅만으로 동작)
- 나중에 서버를 붙일 경우: `storage.js`의 `addReport` / `loadReports`를 API 호출로 바꾸면 됩니다.

## 관리자 시나리오 빌더

- 관리자 로그인: `admin@qa.playground / admin1234!`
- 로그인 후 `site/admin-missions.html` 등에서 카탈로그·제보를 확인 (라벨링 빌더는 준비 중)
- 생성된 `missionDraft`는 런타임에서 동적 미션으로 자동 반영됩니다.

## Playwright 파이프라인

1. 관리자 화면에서 전체 시나리오 JSON 복사
2. `data/scenarios.json`에 붙여넣기
3. `npm install`
4. `npm run scenario:validate`
5. `npm run pw:generate`
6. `npm run pw:test` (테스트 전에 `site/`를 4173 포트로 띄우며, CI에서도 동일)

CI에서도 동일 순서로 검증됩니다.

운영 체크리스트: [Phase 6 Operations](./docs/PHASE6-OPERATIONS.md)

## 로컬 실행

학습자 앱은 ES 모듈(`site/js/spa/main.js`)을 쓰므로 **`file://`로 열면 로드가 막힐 수 있습니다.** 아래처럼 HTTP로 `site` 폴더만 서빙하세요.

```bash
npm run site:serve
# 또는: npx serve site -l 4173
```

브라우저에서 `http://127.0.0.1:4173/` 로 열면 됩니다.

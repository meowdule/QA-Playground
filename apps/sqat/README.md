# SQAT (Software QA Tester) — Next.js 14 앱

스펙 **「SQAT 플랫폼 — Cursor 구현 프롬프트 v2」** Phase 1 골격입니다.  
기존 정적 **테스피어-Tespier**(`site/`)와는 별도 앱으로, `apps/sqat`에서 실행합니다.

## 요구 사항

- Node 20+
- `cp .env.example .env` 후 `npx prisma migrate dev` (최초 1회, SQLite `prisma/dev.db`)

## 명령

```bash
cd apps/sqat
npm install
npx prisma migrate dev
npm run dev
```

브라우저: http://localhost:3000

## 구현 범위 (Phase 1)

| 영역 | 내용 |
|------|------|
| GNB | 학습 / 미션 / 챌린지 / 토론 + 2depth 링크 |
| 학습 | Markdown(`react-markdown` + `remark-gfm`) + 관련 미션 링크 |
| 미션 | 6종 타입별 폼·제출 → `/missions/:id/submit` + AI placeholder |
| 챌린지 | 이론 객관식 즉시 채점 · TC/결함/모의고사는 안내 페이지 |
| 토론 | Prisma SQLite + REST API · 댓글·좋아요·공식 답변 데모 · 댓글 10개 이상 시 AI 요약 버튼(비활성) |
| SQAT | 자격 안내 · 시험 UI(타이머·문항 네비·전체 제출) · 결과(객관식 점수 + 실기 채점중) |
| 관리자 | `/admin/scoring` 기준 답안 폼 UI 자리 |

## 프로덕션 DB

로컬은 SQLite입니다. PostgreSQL 사용 시 `prisma/schema.prisma`의 `provider`와 `DATABASE_URL`만 교체하면 됩니다.

## 차후 (Phase 2)

- NextAuth.js, 실기 Markdown 에디터(`@uiw/react-md-editor`), AI 채점(Claude), 자격증 PNG

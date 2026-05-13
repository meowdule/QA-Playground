# Phase 4 Playwright Pipeline

## Quick Start

1. Install dependencies
   - `npm install`
2. In admin page, copy **전체 시나리오 JSON**
3. Paste into `data/scenarios.json`
4. Generate specs
   - `npm run pw:generate`
5. Run tests
   - `npm run pw:test`

## Notes

- `e2e/site-smoke.spec.js` is always committed so CI passes when `data/scenarios.json` has no scenarios (the generator then writes no `*.spec.js` files).
- Generated spec files are written to `e2e/generated`.
- Generation reports are written to:
  - `e2e/generated/_generation-report.json`
  - `e2e/generated/_generation-report.md`
- Locator generation uses fallback chain:
  - semantic key mapping -> role -> label -> placeholder -> text -> name/id/testid
- You can set `variant.expectedText` in scenario JSON to force assertion text.
- For authenticated flows, store session in `playwright/.auth/admin.json` (one-time manual login).
- If `data/scenarios.json` has no scenarios, generator exits successfully and writes empty report.

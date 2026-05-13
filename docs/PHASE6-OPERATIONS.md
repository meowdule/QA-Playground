# Phase 6 Operations Checklist

Phase 6 focuses on stabilization and repeatable operations.

## 1) Pre-Release Checklist

- [ ] Admin scenarios exported from `site/admin-scenario.html` and pasted into `data/scenarios.json`
- [ ] `npm run scenario:validate` passes
- [ ] `npm run pw:generate` succeeds and updates `e2e/generated` reports
- [ ] `npm run pw:test` passes locally (or with acceptable known failures)
- [ ] Hidden-objective behavior checked on generated missions (`partial-hidden`, `strict-hidden`)
- [ ] Login routes tested for both normal user and admin user

## 2) CI Quality Gate

CI workflow (`.github/workflows/playwright.yml`) runs:

1. install deps
2. install browsers
3. validate scenarios
4. generate specs
5. run tests
6. upload reports

Any validation failure should block merge.

## 3) Incident Response (Quick)

When generated tests fail unexpectedly:

1. Check `e2e/generated/_generation-report.md`
2. Compare latest `data/scenarios.json` with previous working version
3. Disable problematic variant(s) in admin UI (`enabled = false`)
4. Re-export scenarios and regenerate specs

## 4) Ownership

- Admin UI owner: scenario quality and semantics
- Dev owner: generator/runner reliability
- CI owner: workflow stability and artifacts

import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const authPath = "./playwright/.auth/admin.json";
const hasAuthState = fs.existsSync(authPath);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "npx --yes serve site -l 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium-smoke",
      testMatch: "site-smoke.spec.js",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "chromium-generated",
      testMatch: "generated/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        ...(hasAuthState ? { storageState: authPath } : {})
      }
    }
  ]
});

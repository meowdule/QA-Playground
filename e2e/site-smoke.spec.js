import { test, expect } from "@playwright/test";

test.describe("static site", () => {
  test("home loads and shows learner shell", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/QA Playground/i);
    await expect(page.getByRole("link", { name: "QA Playground" }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "주요 페이지" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "주요 페이지" }).getByRole("link", { name: "시나리오 실습" })
    ).toBeVisible();
  });
});

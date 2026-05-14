import { test, expect } from "@playwright/test";

test.describe("static site", () => {
  test("home loads and shows learner shell", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/테스피어|Tespier/i);
    await expect(page.getByRole("link", { name: "테스피어-Tespier" }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "주요 메뉴" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "미션" })).toBeVisible();
  });
});

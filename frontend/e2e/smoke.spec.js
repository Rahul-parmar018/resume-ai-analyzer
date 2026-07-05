import { test, expect } from "@playwright/test";

test.describe("Candidex AI Smoke Tests", () => {
  test("should render Landing page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Candidex AI/i);
    await expect(page.locator("text=AI-Powered Career Architecture")).toBeVisible();
  });

  test("should load Login page cleanly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Welcome back")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should load Register page cleanly", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("text=Create your account")).toBeVisible();
  });
});

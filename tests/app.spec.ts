import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5040");
  await expect(page).toHaveTitle(/Alaska/);
});

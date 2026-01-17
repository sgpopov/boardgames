import { test, expect } from "@playwright/test";

test("creates Phase 10 game", async ({ page }) => {
  await page.goto("/games/flip7");

  // Click create new game link (exists in list or empty state)
  await page.getByText("Create new game").first().click();
  await expect(page).toHaveURL(/\/games\/flip7\/create-game/);
  await expect(page.getByRole("heading", { name: "New Game" })).toBeVisible();

  // Fill player names
  await page.getByLabel("Player 1").fill("James Bond");
  await page.getByLabel("Player 2").fill("Bruce Wayne");
  await page.getByLabel("Player 3").fill("Barry Allen");

  await page.keyboard.press("Tab");

  // Submit the form
  await page.getByRole("button", { name: "Create game" }).click();

  // Wait for navigation to details page
  await expect(page).toHaveURL(/\/games\/flip7\/game\?id=/);
});

import { test, expect } from "@playwright/test";

test("creates Flip7 game", async ({ page }) => {
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

  await expect(
    page.getByRole("heading", { name: "Game details" })
  ).toBeVisible();

  // Players should appear

  const expectedNames = ["James Bond", "Bruce Wayne", "Barry Allen"];

  const players = await page.locator("[data-slot='item']").all();

  expect(players.length).toBe(3);

  for (const player of players) {
    const playerName = await player
      .locator('[data-slot="item-title"]')
      .textContent();

    const playerScore = await player
      .locator('[data-slot="item-actions"]')
      .textContent();

    expect(playerName, "player name").toEqual(expectedNames.shift());

    expect(playerScore, "player score").toContain("0");
  }
});

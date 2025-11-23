import { test, expect } from "@playwright/test";

test("creates Phase 10 game", async ({ page }) => {
  await page.goto("/games/phase10");

  // Click create new game link (exists in list or empty state)
  await page.getByText("Create new game").first().click();
  await expect(page).toHaveURL(/\/games\/phase10\/new/);
  await expect(page.getByRole("heading", { name: "New Game" })).toBeVisible();

  // Add two more players (default has one)
  await page.getByRole("button", { name: "Add Player" }).click();
  await page.getByRole("button", { name: "Add Player" }).click();

  // Fill player names
  await page.getByLabel("Player 1").fill("James Bond");
  await page.getByLabel("Player 2").fill("Bruce Wayne");
  await page.getByLabel("Player 3").fill("Barry Allen");

  await page.keyboard.press("Tab");

  // Submit the form
  await page.getByRole("button", { name: "Create game" }).click();

  // Wait for navigation to details page
  await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);

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

    const playerPhase = await player
      .locator('[data-slot="item-description"]')
      .textContent();

    const playerScore = await player
      .locator('[data-slot="item-actions"]')
      .textContent();

    expect(playerName, "player name").toEqual(expectedNames.shift());

    expect(playerPhase, "player phase").toContain("Phase 1");
    expect(playerPhase, "phase details").toContain("2 sets of 3");

    expect(playerScore, "player score").toContain("0");
  }
});

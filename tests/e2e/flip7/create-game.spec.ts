import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test("a11y smoke - no games", async ({ page }) => {
  await page.goto("/games/flip7");

  // Wait for the client-rendered content to hydrate before scanning, otherwise
  // axe can run against the pre-hydration HTML and report a missing <h1>.
  await expect(
    page.getByRole("heading", { name: "No games found" }),
  ).toBeVisible();

  const scanResults = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();

  expect(scanResults.violations).toEqual([]);
});

test("creates Flip7 game", async ({ page }) => {
  await page.goto("/games/flip7");

  // Click create new game link (exists in list or empty state)
  await page.getByText("Create new game").first().click();
  await expect(page).toHaveURL(/\/games\/flip7\/create-game/);
  await expect(page.getByRole("heading", { name: "New Game" })).toBeVisible();

  // Fill player names (re-fill until the form is submittable so we don't race
  // client hydration, which would otherwise discard the typed values).
  const submit = page.getByRole("button", { name: "Create game" });

  await expect(async () => {
    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");

    await expect(submit).toBeEnabled({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });

  // Submit the form
  await submit.click();

  // Wait for navigation to details page
  await expect(page).toHaveURL(/\/games\/flip7\/game\?id=/);

  await expect(
    page.getByRole("heading", { name: "Game details" }),
  ).toBeVisible();

  // Players should appear

  const expectedNames = ["James Bond", "Bruce Wayne", "Barry Allen"];

  const items = page.locator("[data-slot='item']");
  await expect(items).toHaveCount(3);
  const players = await items.all();

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

  const scanResults = await new AxeBuilder({ page }).analyze();

  expect(scanResults.violations).toEqual([]);
});

import { test, expect } from "@playwright/test";

test.describe("Flip 7 Score Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/flip7/create-game");

    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");

    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
  });

  test("updates player scores and verifies the results", async ({ page }) => {
    // fill in player scores
    await page.getByRole("button", { name: "Score round" }).click();

    await page.waitForSelector("form", { state: "visible" });

    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");

    await page.keyboard.press("Tab");

    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/flip7\/game\?id=/);

    // Players should appear

    const expectedNames = ["James Bond", "Bruce Wayne", "Barry Allen"];
    const expectedScores = ["10", "25", "30"];

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

      expect(playerScore, "player score").toEqual(expectedScores.shift());
    }
  });

  test("scores multiple rounds", async ({ page }) => {
    // fill in player scores - round 1
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForSelector("form", { state: "visible" });
    await expect(page.getByText("Round 1 results")).toBeVisible();
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    // fill in player scores - round 2
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForSelector("form", { state: "visible" });
    await expect(page.getByText("Round 2 results")).toBeVisible();
    await page.getByTestId("player-0-score").fill("0");
    await page.getByTestId("player-1-score").fill("32");
    await page.getByTestId("player-2-score").fill("17");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/flip7\/game\?id=/);

    // validate scores
    const expectedScores = ["10", "57", "47"];
    const players = await page.locator("[data-slot='item']").all();

    await expect(page.getByText("2 rounds played")).toBeVisible();

    expect(players.length).toBe(3);

    for (const player of players) {
      const playerScore = await player
        .locator('[data-slot="item-actions"]')
        .textContent();

      expect(playerScore, "player score").toEqual(expectedScores.shift());
    }
  });
});

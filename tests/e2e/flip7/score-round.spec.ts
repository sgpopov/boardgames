import { test, expect } from "@playwright/test";

test.describe("Flip 7 Score Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/flip7/create-game");

    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");

    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForURL("/games/flip7/game?id=**");
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

  test("validates form", async ({ page }) => {
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForSelector("form", { state: "visible" });

    await page.getByTestId("player-0-score").fill("50");
    await page.getByTestId("player-1-score").fill("string"); // wrong input
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");

    await expect(
      page.getByText("Invalid input: expected number, received string"),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Save Round" }),
    ).toBeDisabled();
  });

  test("prevents adding scores to a completed game", async ({ page }) => {
    const pageUrl = new URL(page.url());
    const gameId = pageUrl.searchParams.get("id");

    // fill in player scores
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForSelector("form", { state: "visible" });
    await page.getByTestId("player-0-score").fill("201"); // winner
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    // navigate directly to the round scoring page
    await page.goto(`/games/flip7/add-scores?gameId=${gameId}`);

    await page.waitForURL("/games/flip7/add-scores?gameId=**");

    await expect(
      page.getByText(
        "This game is already completed and you cannot add round scores",
      ),
    ).toBeVisible();

    // validate that no form elements are shown
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByTestId("player-0-score")).toHaveCount(0);
    await expect(page.getByTestId("player-1-score")).toHaveCount(0);
    await expect(page.getByTestId("player-2-score")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Save Round" })).toHaveCount(
      0,
    );
  });
});

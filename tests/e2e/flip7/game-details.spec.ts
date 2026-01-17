import { test, expect } from "@playwright/test";

test.describe("Flip 7 Game Details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/flip7/create-game");

    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");

    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForURL("/games/flip7/game?id=**");
  });

  test("display players and their initial scores", async ({ page }) => {
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

      expect(playerScore, "player score").toEqual("0");
    }

    await expect(
      page.getByRole("button", { name: "Score round" })
    ).toBeVisible();

    await expect(
      page.getByText("This game has been completed")
    ).not.toBeVisible();
  });

  test("should indicate games completion", async ({ page }) => {
    // complete the game first
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForSelector("form", { state: "visible" });
    await page.getByTestId("player-0-score").fill("123");
    await page.getByTestId("player-1-score").fill("205");
    await page.getByTestId("player-2-score").fill("150");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();
    await page.waitForURL("/games/flip7/game?id=**");

    await expect(
      page.getByRole("button", { name: "Score round" })
    ).not.toBeVisible();

    await expect(page.getByText("This game has been completed")).toBeVisible();

    const players = await page.locator("[data-slot='item']").all();

    const playerDetails = [
      await players[0].locator('[data-slot="item-content"]').textContent(),
      await players[1].locator('[data-slot="item-content"]').textContent(),
      await players[2].locator('[data-slot="item-content"]').textContent(),
    ];

    expect(playerDetails[0]).toContain("James Bond");
    expect(playerDetails[0]).not.toContain("Winner");

    expect(playerDetails[1]).toContain("Bruce Wayne");
    expect(playerDetails[1]).toContain("Winner");

    expect(playerDetails[2]).toContain("Barry Allen");
    expect(playerDetails[2]).not.toContain("Winner");
  });
});

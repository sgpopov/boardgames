import { test, expect } from "@playwright/test";
import { createPhase10Game } from "./helpers";

test.describe("Phase 10 Score Round", () => {
  test.beforeEach(async ({ page }) => {
    await createPhase10Game(page);
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForURL(/\/games\/phase10\/round-score\?gameId=/);
    await expect(
      page.getByRole("heading", { name: "Score round" }),
    ).toBeVisible();
  });

  test("scores a single round and returns to game details", async ({
    page,
  }) => {
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);
    await expect(page.getByText("1 rounds played")).toBeVisible();

    const expectedScores = ["10", "25", "30"];
    const players = await page.locator("[data-slot='item']").all();

    expect(players.length).toBe(3);

    for (const player of players) {
      const score = await player
        .locator('[data-slot="item-actions"]')
        .textContent();
      expect(score).toEqual(expectedScores.shift());
    }
  });

  test("scores multiple rounds with cumulative totals", async ({ page }) => {
    // Round 1
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);

    // Round 2
    await page.getByRole("button", { name: "Score round" }).click();
    await page.waitForURL(/\/games\/phase10\/round-score\?gameId=/);
    await page.getByTestId("player-0-score").fill("5");
    await page.getByTestId("player-1-score").fill("0");
    await page.getByTestId("player-2-score").fill("15");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);
    await expect(page.getByText("2 rounds played")).toBeVisible();

    const expectedScores = ["15", "25", "45"];
    const players = await page.locator("[data-slot='item']").all();

    for (const player of players) {
      const score = await player
        .locator('[data-slot="item-actions"]')
        .textContent();
      expect(score).toEqual(expectedScores.shift());
    }
  });

  test("validates score inputs — must be divisible by 5", async ({ page }) => {
    await page.getByTestId("player-0-score").fill("7");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.keyboard.press("Tab");

    await expect(page.getByText("Score must be divisible by 5")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save Round" }),
    ).toBeDisabled();
  });

  test("phase increment and decrement controls work", async ({ page }) => {
    const player0Phase = page.getByTestId("player-0-phase");

    // Increase player 0 to phase 3
    await page.getByTestId("player-0-increase-phase").click();
    await page.getByTestId("player-0-increase-phase").click();
    await expect(player0Phase).toHaveText("3");

    // Decrease back to 2
    await page.getByTestId("player-0-decrease-phase").click();
    await expect(player0Phase).toHaveText("2");

    // Decrease to 1; button should then be disabled
    await page.getByTestId("player-0-decrease-phase").click();
    await expect(player0Phase).toHaveText("1");
    await expect(
      page.getByTestId("player-0-decrease-phase"),
    ).toBeDisabled();
  });

  test("phase changes persist in game details after saving", async ({
    page,
  }) => {
    // Increase player 0 to phase 3
    await page.getByTestId("player-0-increase-phase").click();
    await page.getByTestId("player-0-increase-phase").click();

    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("0");
    await page.getByTestId("player-2-score").fill("5");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Save Round" }).click();

    await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);

    const player0 = page.locator("[data-slot='item']").first();
    const description = await player0
      .locator('[data-slot="item-description"]')
      .textContent();

    expect(description).toContain("Phase 3");
    expect(description).toContain("1 set of 4 and 1 run of 4");
  });
});

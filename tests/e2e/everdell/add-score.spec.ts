import { test, expect } from "@playwright/test";

test.describe("Everdell Player Score Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/everdell/create-game");

    await page.getByRole("button", { name: "Add Player" }).click();
    await page.getByRole("button", { name: "Add Player" }).click();

    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");

    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
  });

  test("updates player scores and verifies the results", async ({ page }) => {
    // fill in player scores
    await page.getByRole("link", { name: "Edit score for Cards" }).click();
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.getByRole("button", { name: "Save scores" }).click();
    await page.waitForSelector("table", { state: "visible" });

    // validate scores
    const table = page.locator("table");

    const playerScores = await table
      .locator("tbody tr")
      .evaluateAll((rows) =>
        rows.map((row) =>
          Array.from(row.querySelectorAll("td")).map((cell) =>
            cell.textContent?.trim()
          )
        )
      );

    expect(playerScores).not.toBeNull();

    expect(playerScores).toEqual([
      ["Cards", "10", "25", "30"],
      ["Prosperity", "0", "0", "0"],
      ["Events", "0", "0", "0"],
      ["Journey", "0", "0", "0"],
      ["Point tokens", "0", "0", "0"],
    ]);

    const totalScores = await table
      .locator("tfoot td")
      .evaluateAll((cells) => cells.map((cell) => cell.textContent));

    expect(totalScores).toEqual(["Total", "10", "25", "30"]);
  });

  test("updates multiple components scores", async ({ page }) => {
    // fill in scores for the "Cards" component
    await page.getByRole("link", { name: "Edit score for Cards" }).click();
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("25");
    await page.getByTestId("player-2-score").fill("30");
    await page.getByRole("button", { name: "Save scores" }).click();
    await page.waitForSelector("table", { state: "visible" });

    // fill in scores for the "Prosperity" component
    await page.getByRole("link", { name: "Edit score for Prosperity" }).click();
    await page.getByTestId("player-0-score").fill("0");
    await page.getByTestId("player-1-score").fill("12");
    await page.getByTestId("player-2-score").fill("8");
    await page.getByRole("button", { name: "Save scores" }).click();
    await page.waitForSelector("table", { state: "visible" });

    // validate scores
    const table = page.locator("table");

    const playerScores = await table
      .locator("tbody tr")
      .evaluateAll((rows) =>
        rows.map((row) =>
          Array.from(row.querySelectorAll("td")).map((cell) =>
            cell.textContent?.trim()
          )
        )
      );

    expect(playerScores).not.toBeNull();

    expect(playerScores).toEqual([
      ["Cards", "10", "25", "30"],
      ["Prosperity", "0", "12", "8"],
      ["Events", "0", "0", "0"],
      ["Journey", "0", "0", "0"],
      ["Point tokens", "0", "0", "0"],
    ]);

    const totalScores = await table
      .locator("tfoot td")
      .evaluateAll((cells) => cells.map((cell) => cell.textContent));

    expect(totalScores).toEqual(["Total", "10", "37", "38"]);
  });
});

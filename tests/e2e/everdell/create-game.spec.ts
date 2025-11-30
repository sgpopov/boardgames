import { test, expect } from "@playwright/test";

test("creates Everdell game", async ({ page }) => {
  await page.goto("/games/everdell");

  // Click create new game link (exists in list or empty state)
  await page.getByText("Create new game").first().click();
  await expect(page).toHaveURL(/\/games\/everdell\/create-game/);
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
  await expect(page).toHaveURL(/\/games\/everdell\/game\?id=/);

  // Verify players are listed with initial scores

  const table = page.locator("table");

  // verify players names
  const tableHeadingValues = await table
    .locator("thead th")
    .evaluateAll((row) => row.map((cell) => cell.textContent));

  expect(tableHeadingValues).toEqual(["Player", "J", "B", "B"]);

  // verify players scores for each category
  const playersScores = await table
    .locator("tbody tr")
    .evaluateAll((rows) => {
      return rows.map((row) => {
        return Array.from(row.querySelectorAll("td")).map((cell) =>
          cell.textContent?.trim()
        );
      });
    });

  expect(playersScores).not.toBeNull();

  expect(playersScores).toEqual([
    ["Cards", "0", "0", "0"],
    ["Prosperity", "0", "0", "0"],
    ["Events", "0", "0", "0"],
    ["Journey", "0", "0", "0"],
    ["Point tokens", "0", "0", "0"],
  ]);

  // verify players total score
  const playersTotalScores = await table
    .locator("tfoot td")
    .evaluateAll((cells) => cells.map((cell) => cell.textContent));

  expect(playersTotalScores).toEqual(["Total", "0", "0", "0"]);
});

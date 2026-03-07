import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Everdell - Create game", () => {
  test("a11y smoke", async ({ page }) => {
    await page.goto("/games/everdell/create-game");

    const scanResults = await new AxeBuilder({ page }).analyze();

    expect(scanResults.violations).toEqual([]);
  });

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

    await expect(table.locator("thead th")).toHaveText([
      "Player",
      "J",
      "B",
      "B",
    ]);
    await expect(table.locator("tbody tr").nth(0).locator("td")).toHaveText([
      "Cards",
      "0",
      "0",
      "0",
    ]);

    await expect(table.locator("tbody tr").nth(1).locator("td")).toHaveText([
      "Prosperity",
      "0",
      "0",
      "0",
    ]);

    await expect(table.locator("tbody tr").nth(2).locator("td")).toHaveText([
      "Events",
      "0",
      "0",
      "0",
    ]);

    await expect(table.locator("tbody tr").nth(3).locator("td")).toHaveText([
      "Journey",
      "0",
      "0",
      "0",
    ]);

    await expect(table.locator("tbody tr").nth(4).locator("td")).toHaveText([
      "Point tokens",
      "0",
      "0",
      "0",
    ]);

    await expect(table.locator("tfoot td")).toHaveText([
      "Total",
      "0",
      "0",
      "0",
    ]);
  });
});

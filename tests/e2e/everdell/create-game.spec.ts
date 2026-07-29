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
    await page.getByLabel("Player 1", { exact: true }).fill("James Bond");
    await page.getByLabel("Player 2", { exact: true }).fill("Bruce Wayne");
    await page.getByLabel("Player 3", { exact: true }).fill("Barry Allen");

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

  test("assigns a character to every player and keeps it unique", async ({
    page,
  }) => {
    await page.goto("/games/everdell/create-game");

    const player1 = page.getByRole("group", { name: "Player 1 character" });

    await expect(
      player1.getByRole("button", { name: "Squirrel" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Add Player" }).click();

    const player2 = page.getByRole("group", { name: "Player 2 character" });

    await expect(
      player2.getByRole("button", { name: "Turtle" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      player2.getByRole("button", { name: "Squirrel" }),
    ).toBeDisabled();

    await player2.getByRole("button", { name: "Hedgehog" }).click();

    await expect(
      player2.getByRole("button", { name: "Hedgehog" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(player1.getByRole("button", { name: "Turtle" })).toBeEnabled();

    await page.getByLabel("Player 1", { exact: true }).fill("James Bond");
    await page.getByLabel("Player 2", { exact: true }).fill("Bruce Wayne");

    await page.getByRole("button", { name: "Create game" }).click();
    await expect(page).toHaveURL(/\/games\/everdell\/game\?id=/);

    await page.reload();

    // Characters have no on-screen surface until the podium ships, so stored
    // state is the only place to observe that the choices survived a reload.
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("boardgames:everdell:games"),
    );
    const games = JSON.parse(stored ?? "[]") as {
      players: { name: string; character: string }[];
    }[];

    expect(games[0].players).toMatchObject([
      { name: "James Bond", character: "squirrel" },
      { name: "Bruce Wayne", character: "hedgehog" },
    ]);
  });
});

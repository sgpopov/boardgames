import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Everdell Game Details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/everdell/create-game");

    await page.getByRole("button", { name: "Add Player" }).click();
    await page.getByRole("button", { name: "Add Player" }).click();

    await page.getByLabel("Player 1").fill("Alice");
    await page.getByLabel("Player 2").fill("Bob");
    await page.getByLabel("Player 3").fill("Carol");

    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForSelector("table", { state: "visible" });
  });

  test("a11y smoke - game details (in progress)", async ({ page }) => {
    const scanResults = await new AxeBuilder({ page }).analyze();

    expect(scanResults.violations).toEqual([]);
  });

  test("shows action menu button and no completion banner for in-progress game", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Game actions" }),
    ).toBeVisible();

    await expect(
      page.getByText("This game has been completed"),
    ).not.toBeVisible();
  });

  test("score category links are clickable for in-progress game", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: "Edit score for Cards" }),
    ).toBeVisible();
  });

  test("completes a game via the action menu and shows completion banner with winner", async ({
    page,
  }) => {
    // give Alice the highest score
    await page.getByRole("link", { name: "Edit score for Cards" }).click();
    await page.getByTestId("player-0-score").fill("50");
    await page.getByTestId("player-1-score").fill("30");
    await page.getByTestId("player-2-score").fill("20");
    await page.getByRole("button", { name: "Save scores" }).click();
    await page.waitForSelector("table", { state: "visible" });

    // open action menu and complete the game
    await page.getByRole("button", { name: "Game actions" }).click();
    await page.getByRole("menuitem", { name: "Complete game" }).click();

    // confirm in the alert dialog
    await page.getByRole("button", { name: "Complete game" }).click();

    // completion banner with winner name should appear
    await expect(page.getByText("This game has been completed")).toBeVisible();
    await expect(page.getByText("Alice wins!")).toBeVisible();

    // action menu should be gone
    await expect(
      page.getByRole("button", { name: "Game actions" }),
    ).not.toBeVisible();
  });

  test("score category links are disabled after game is completed", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Game actions" }).click();
    await page.getByRole("menuitem", { name: "Complete game" }).click();
    await page.getByRole("button", { name: "Complete game" }).click();

    await expect(page.getByText("This game has been completed")).toBeVisible();

    // score edit links should no longer exist
    await expect(
      page.getByRole("link", { name: "Edit score for Cards" }),
    ).toHaveCount(0);
  });

  test("navigating to the score form of a completed game shows a block message", async ({
    page,
  }) => {
    // capture the score URL before completing
    await page.getByRole("link", { name: "Edit score for Cards" }).click();
    await page.getByRole("button", { name: "Save scores" }).waitFor();
    const scoreUrl = page.url();
    await page.goBack();
    await page.waitForSelector("table", { state: "visible" });

    // complete the game
    await page.getByRole("button", { name: "Game actions" }).click();
    await page.getByRole("menuitem", { name: "Complete game" }).click();
    await page.getByRole("button", { name: "Complete game" }).click();
    await expect(page.getByText("This game has been completed")).toBeVisible();

    // navigate to the score form directly
    await page.goto(scoreUrl);

    await expect(
      page.getByText("This game is already completed"),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go back" })).toBeVisible();
  });

  test("a11y smoke - completed game", async ({ page }) => {
    await page.getByRole("button", { name: "Game actions" }).click();
    await page.getByRole("menuitem", { name: "Complete game" }).click();
    await page.getByRole("button", { name: "Complete game" }).click();
    await expect(page.getByText("This game has been completed")).toBeVisible();

    const scanResults = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();

    expect(scanResults.violations).toEqual([]);
  });

  test("shows trophy icon for the winner in the totals row", async ({
    page,
  }) => {
    // Bob wins
    await page.getByRole("link", { name: "Edit score for Prosperity" }).click();
    await page.getByTestId("player-0-score").fill("10");
    await page.getByTestId("player-1-score").fill("40");
    await page.getByTestId("player-2-score").fill("25");
    await page.getByRole("button", { name: "Save scores" }).click();
    await page.waitForSelector("table", { state: "visible" });

    await page.getByRole("button", { name: "Game actions" }).click();
    await page.getByRole("menuitem", { name: "Complete game" }).click();
    await page.getByRole("button", { name: "Complete game" }).click();
    await expect(page.getByText("Bob wins!")).toBeVisible();

    // winner sr-only text should be present in the DOM for the winner's cell
    await expect(page.getByText("Winner")).toHaveCount(1)
  });
});

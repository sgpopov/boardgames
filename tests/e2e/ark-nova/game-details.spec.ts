import AxeBuilder from "@axe-core/playwright";
import { test, expect, Page } from "@playwright/test";

async function createGame(page: Page) {
  await page.goto("/games/ark-nova/create-game");

  await page.getByRole("button", { name: "Add Player" }).click();

  await page.getByLabel("Player 1").fill("Alice");
  await page.getByLabel("Player 2").fill("Bob");

  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Create game" }).click();
  await page.waitForSelector('ol', { state: "visible" });
}

async function enterScores(
  page: Page,
  alice: { appeal: string; cp: string },
  bob: { appeal: string; cp: string },
) {
  await page.getByRole("link", { name: "Enter scores" }).click();

  await page.locator("#player-0-appeal").fill(alice.appeal);
  await page.locator("#player-0-cp").fill(alice.cp);
  await page.locator("#player-1-appeal").fill(bob.appeal);
  await page.locator("#player-1-cp").fill(bob.cp);

  await page.getByRole("button", { name: "Save scores" }).click();
  await page.getByRole("button", { name: "Complete game" }).waitFor();
}

async function completeGame(page: Page) {
  await page.getByRole("button", { name: "Complete game" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Complete game" })
    .click();
}

test.describe("Ark Nova - Game details", () => {
  test("Complete game is disabled until every player is scored", async ({
    page,
  }) => {
    await createGame(page);

    await expect(
      page.getByRole("button", { name: "Complete game" }),
    ).toBeDisabled();
  });

  test("completes a game and shows the winner with switchable rankings", async ({
    page,
  }) => {
    await createGame(page);

    // Alice ends with the higher VP under both methods.
    await enterScores(
      page,
      { appeal: "70", cp: "22" },
      { appeal: "50", cp: "20" },
    );

    await completeGame(page);

    // Winner banner names Alice and marks the winner beyond colour.
    await expect(page.getByText("WINNER", { exact: true })).toBeVisible();
    await expect(page.getByText("Alice").first()).toBeVisible();

    // Method toggle switches the ranking.
    const officialToggle = page.getByRole("button", { name: "Official VP" });
    const alternativeToggle = page.getByRole("button", {
      name: "Alternative VP",
    });
    await expect(officialToggle).toHaveAttribute("aria-pressed", "true");

    await alternativeToggle.click();
    await expect(alternativeToggle).toHaveAttribute("aria-pressed", "true");
    await expect(officialToggle).toHaveAttribute("aria-pressed", "false");

    // Completed games are read-only: no edit / complete / breakdown actions.
    await expect(
      page.getByRole("button", { name: "Complete game" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /full breakdown/i }),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Edit scores" })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Game actions" }),
    ).toHaveCount(0);
  });

  test("a11y smoke - completed results", async ({ page }) => {
    await createGame(page);
    await enterScores(
      page,
      { appeal: "70", cp: "22" },
      { appeal: "50", cp: "20" },
    );
    await completeGame(page);

    await expect(
      page.getByRole("button", { name: "Official VP" }),
    ).toBeVisible();

    const scanResults = await new AxeBuilder({ page }).analyze();

    expect(scanResults.violations).toEqual([]);
  });
});

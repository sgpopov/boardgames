import { expect, test } from "@playwright/test";

test.describe("Flip 7 - Games list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/flip7");
  });

  test("displays empty list of games", async ({ page }) => {
    await expect(page.getByText("No games found")).toBeVisible();

    const createNewGameButton = page.getByRole("link", {
      name: "Create new game",
    });

    await expect(createNewGameButton).toBeVisible();

    await createNewGameButton.click();

    await expect(page).toHaveURL(/\/games\/flip7\/create-game/);
  });
});

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

  test("lists game after creation and allows navigation to details", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Create new game" }).click();

    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.getByLabel("Player 3").fill("Barry Allen");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForURL(/\/games\/flip7\/game\?id=/);

    await page.goto("/games/flip7");

    await expect(
      page.getByRole("heading", { name: /Games \(\d+\)/ }),
    ).toBeVisible();

    const gameItem = page.locator("[data-slot='item']").first();
    await expect(gameItem).toBeVisible();

    await gameItem.click();
    await expect(page).toHaveURL(/\/games\/flip7\/game\?id=/);
  });
});

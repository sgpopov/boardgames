import { test, expect } from "@playwright/test";

test.describe("Everdell - Games list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/everdell");
  });

  test("displays empty state when no games exist", async ({ page }) => {
    await expect(page.getByText("No games found")).toBeVisible();

    const createLink = page.getByRole("link", { name: "Create new game" });
    await expect(createLink).toBeVisible();

    await createLink.click();
    await expect(page).toHaveURL(/\/games\/everdell\/create-game/);
  });

  test("lists game after creation", async ({ page }) => {
    await page.getByRole("link", { name: "Create new game" }).click();

    await page.getByRole("button", { name: "Add Player" }).click();
    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForURL(/\/games\/everdell\/game\?id=/);

    await page.goto("/games/everdell");

    const gameItems = page.locator("[data-slot='item']");
    await expect(gameItems).toHaveCount(1);
    await expect(page.getByText("No games found")).not.toBeVisible();
  });
});

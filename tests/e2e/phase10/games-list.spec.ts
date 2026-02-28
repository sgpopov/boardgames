import { test, expect } from "@playwright/test";

test.describe("Phase 10 - Games list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/phase10");
  });

  test("displays empty state when no games exist", async ({ page }) => {
    await expect(page.getByText("No games found")).toBeVisible();

    const createLink = page.getByRole("link", { name: "Create new game" });
    await expect(createLink).toBeVisible();

    await createLink.click();
    await expect(page).toHaveURL(/\/games\/phase10\/new/);
  });

  test("lists game after creation and shows count heading", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Create new game" }).click();

    await page.getByRole("button", { name: "Add Player" }).click();
    await page.getByLabel("Player 1").fill("James Bond");
    await page.getByLabel("Player 2").fill("Bruce Wayne");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Create game" }).click();
    await page.waitForURL(/\/games\/phase10\/game\?id=/);

    await page.goto("/games/phase10");

    await expect(
      page.getByRole("heading", { name: "Games (1)" }),
    ).toBeVisible();

    const gameItems = page.locator("[data-slot='item']");
    await expect(gameItems).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Create new game" }),
    ).toBeVisible();
  });
});

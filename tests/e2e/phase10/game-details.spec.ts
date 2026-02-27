import { test, expect } from "@playwright/test";
import { createPhase10Game } from "./helpers";

test.describe("Phase 10 Game Details", () => {
  test.beforeEach(async ({ page }) => {
    await createPhase10Game(page);
  });

  test("shows player list, round count, and Score round button", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Game details" }),
    ).toBeVisible();
    await expect(page.getByText("0 rounds played")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Score round" }),
    ).toBeVisible();

    const players = await page.locator("[data-slot='item']").all();
    expect(players.length).toBe(3);

    for (const player of players) {
      const description = await player
        .locator('[data-slot="item-description"]')
        .textContent();
      expect(description).toContain("Phase 1");
      expect(description).toContain("2 sets of 3");
    }
  });

  test("cancels game deletion when dismissed", async ({ page }) => {
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("heading", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();

    // Should still be on the game details page
    await expect(page).toHaveURL(/\/games\/phase10\/game\?id=/);
    await expect(
      page.getByRole("heading", { name: "Game details" }),
    ).toBeVisible();
  });

  test("deletes game and navigates back to games list", async ({ page }) => {
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("heading", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL(/\/games\/phase10$/);
    await expect(page.getByText("No games found")).toBeVisible();
  });
});

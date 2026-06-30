import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { createFlip7Game, scoreFlip7Round } from "./helpers";

test.describe("Flip 7 Game Details", () => {
  test.beforeEach(async ({ page }) => {
    await createFlip7Game(page, ["James Bond", "Bruce Wayne", "Barry Allen"]);
  });

  test("a11y smoke", async ({ page }) => {
    const scanResults = await new AxeBuilder({ page }).analyze();

    expect(scanResults.violations).toEqual([]);
  });

  test("display players and their initial scores", async ({ page }) => {
    const expectedNames = ["James Bond", "Bruce Wayne", "Barry Allen"];
    const items = page.locator("[data-slot='item']");
    await expect(items).toHaveCount(3);
    const players = await items.all();

    for (const player of players) {
      const playerName = await player
        .locator('[data-slot="item-title"]')
        .textContent();

      const playerScore = await player
        .locator('[data-slot="item-actions"]')
        .textContent();

      expect(playerName, "player name").toEqual(expectedNames.shift());

      expect(playerScore, "player score").toEqual("0");
    }

    await expect(
      page.getByRole("button", { name: "Score round" }),
    ).toBeVisible();

    await expect(
      page.getByText("This game has been completed"),
    ).not.toBeVisible();
  });

  test("should indicate games completion", async ({ page }) => {
    // complete the game first
    await scoreFlip7Round(page, ["123", "205", "150"]);

    await expect(
      page.getByRole("button", { name: "Score round" }),
    ).not.toBeVisible();

    await expect(page.getByText("This game has been completed")).toBeVisible();

    const items = page.locator("[data-slot='item']");
    await expect(items).toHaveCount(3);
    const players = await items.all();

    const playerDetails = [
      await players[0].locator('[data-slot="item-content"]').textContent(),
      await players[1].locator('[data-slot="item-content"]').textContent(),
      await players[2].locator('[data-slot="item-content"]').textContent(),
    ];

    expect(playerDetails[0]).toContain("James Bond");
    expect(playerDetails[0]).not.toContain("Winner");

    expect(playerDetails[1]).toContain("Bruce Wayne");
    expect(playerDetails[1]).toContain("Winner");

    expect(playerDetails[2]).toContain("Barry Allen");
    expect(playerDetails[2]).not.toContain("Winner");
  });
});

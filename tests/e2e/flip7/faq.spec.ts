import { test, expect } from "@playwright/test";

test.describe("Flip 7 FAQ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/games/flip7/faq");
  });

  test("displays the FAQ heading, search input, and accordion items", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible();
    await expect(page.getByPlaceholder("Search...")).toBeVisible();

    // At least one accordion trigger should be visible
    const triggers = page.getByRole("button").filter({ hasText: /\?/ });
    await expect(triggers.first()).toBeVisible();
  });

  test("search filters accordion items", async ({ page }) => {
    // "Freeze" appears in multiple FAQ questions — should return results
    await page.getByPlaceholder("Search...").fill("Freeze");
    const matchingTriggers = page.getByRole("button").filter({ hasText: /Freeze/ });
    await expect(matchingTriggers.first()).toBeVisible();

    // Gibberish should match nothing
    await page.getByPlaceholder("Search...").fill("xzxzxzxzxzxz");
    const noTriggers = page.getByRole("button").filter({ hasText: /\?/ });
    await expect(noTriggers).toHaveCount(0);
  });

  test("accordion opens and collapses content", async ({ page }) => {
    const firstTrigger = page.getByRole("button").filter({ hasText: /\?/ }).first();
    await expect(firstTrigger).toBeVisible();

    // Open the first item
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("data-state", "open");

    // Collapse it again
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("data-state", "closed");
  });
});

import { test, expect } from "@playwright/test";

test("homepage should list all supported games", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Board Game Companion" })
  ).toBeVisible();

  const gameLinks = await page.getByRole("link").evaluateAll((links) => {
    return links.map((l) => l.getAttribute("href"));
  });

  expect(gameLinks).toEqual(["/games/phase10"]);

  await expect(page.getByRole("heading", { name: "Phase 10" })).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("homepage should list all supported games", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Tally" })).toBeVisible();

  const list = page.getByRole("list");
  const gameLinks = await list.getByRole("link").evaluateAll((links) => {
    return links.map((l) => l.getAttribute("href"));
  });

  expect(gameLinks).toEqual([
    "/games/ark-nova",
    "/games/everdell",
    "/games/flip7",
    "/games/phase10",
  ]);

  const gameNames = await list.getByRole("heading").allTextContents();

  expect(gameNames).toEqual(["Ark Nova", "Everdell", "Flip 7", "Phase 10"]);
});

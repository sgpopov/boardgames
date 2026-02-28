import { Page } from "@playwright/test";

export async function createPhase10Game(
  page: Page,
  players = ["James Bond", "Bruce Wayne", "Barry Allen"],
): Promise<string> {
  await page.goto("/games/phase10/new");

  // Default form has 1 player field; add more as needed
  for (let i = 0; i < players.length - 1; i++) {
    await page.getByRole("button", { name: "Add Player" }).click();
  }

  for (let i = 0; i < players.length; i++) {
    await page.getByLabel(`Player ${i + 1}`).fill(players[i]);
  }

  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Create game" }).click();
  await page.waitForURL("/games/phase10/game?id=**");

  const url = new URL(page.url());
  return url.searchParams.get("id") as string;
}

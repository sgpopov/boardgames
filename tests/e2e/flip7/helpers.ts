import { expect, type Page } from "@playwright/test";

/**
 * Create a Flip 7 game via the UI.
 *
 * The app is client-only: routes are server-rendered as static HTML and only
 * become interactive once React hydrates. A `fill()` that lands before
 * hydration is discarded (the controlled input is reset to its default and the
 * form stays pristine), leaving the submit button disabled. This is most
 * visible on the slowest engine (Mobile Safari) and on a cold dev server that
 * compiles the route on demand.
 *
 * To stay deterministic we re-fill every field until the form reports itself as
 * submittable (the "Create game" button enables only when the form is valid and
 * dirty), which guarantees React has hydrated and registered our input.
 */
export async function createFlip7Game(page: Page, names: string[]) {
  await page.goto("/games/flip7/create-game");

  const submit = page.getByRole("button", { name: "Create game" });

  await expect(async () => {
    for (const [index, name] of names.entries()) {
      await page.getByLabel(`Player ${index + 1}`).fill(name);
    }

    await expect(submit).toBeEnabled({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });

  await submit.click();

  await page.getByRole("heading", { name: "Game details" }).waitFor();
}

/**
 * Open the round-scoring form and fill in each player's score.
 *
 * Like the create form, the score inputs are controlled and only register
 * changes once hydrated, so we fill every field and then re-verify the values
 * stuck — retrying the whole batch if hydration reset them. Saving is left to
 * the caller so this also covers validation tests that never submit.
 */
export async function fillRoundScores(page: Page, scores: string[]) {
  await page.getByRole("button", { name: "Score round" }).click();
  await page.waitForSelector("form", { state: "visible" });

  await expect(async () => {
    for (const [index, score] of scores.entries()) {
      await page.getByTestId(`player-${index}-score`).fill(score);
    }

    for (const [index, score] of scores.entries()) {
      await expect(page.getByTestId(`player-${index}-score`)).toHaveValue(score);
    }
  }).toPass({ timeout: 15_000 });
}

/** Fill a round's scores and save, waiting for the redirect to settle. */
export async function scoreFlip7Round(page: Page, scores: string[]) {
  await fillRoundScores(page, scores);

  const save = page.getByRole("button", { name: "Save Round" });
  await expect(save).toBeEnabled();
  await save.click();

  await page.getByRole("heading", { name: "Game details" }).waitFor();
}

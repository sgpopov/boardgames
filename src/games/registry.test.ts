import { describe, expect, it } from "vitest";
import { GAME_MODULES, compareGameNames } from "@/games/registry";

describe("GAME_MODULES", () => {
  it("is ordered alphabetically by name", () => {
    expect(GAME_MODULES.map((game) => game.name)).toEqual([
      "Ark Nova",
      "Everdell",
      "Flip 7",
      "Phase 10",
    ]);
  });
});

describe("compareGameNames", () => {
  it("orders numbered names by value rather than by digit", () => {
    const names = ["Phase 10", "Phase 9", "Phase 2"].sort(compareGameNames);

    expect(names).toEqual(["Phase 2", "Phase 9", "Phase 10"]);
  });

  it("collates diacritics the same way regardless of the runtime locale", () => {
    // sv-SE sorts "Ö" after "Z"; the pinned "en" collator must not follow it.
    const names = ["Zoo Tycoon", "Öko", "Ark Nova"].sort(compareGameNames);

    expect(names).toEqual(["Ark Nova", "Öko", "Zoo Tycoon"]);
  });
});

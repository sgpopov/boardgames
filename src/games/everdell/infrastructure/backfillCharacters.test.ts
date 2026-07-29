import { describe, expect, it } from "vitest";
import { backfillCharacters } from "./backfillCharacters";

describe("backfillCharacters", () => {
  it("gives a stored player with no character one, by catalogue order", () => {
    const players = backfillCharacters([
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
      { name: "Dana" },
    ]);

    expect(players).toEqual([
      { name: "Alice", character: "squirrel" },
      { name: "Bob", character: "turtle" },
      { name: "Charlie", character: "mouse" },
      { name: "Dana", character: "hedgehog" },
    ]);
  });

  it("leaves a stored player that already has a character untouched", () => {
    const stored = [{ name: "Alice", character: "hedgehog" }];

    expect(backfillCharacters(stored)).toEqual([
      { name: "Alice", character: "hedgehog" },
    ]);
  });

  it("fills only the players that are missing a character", () => {
    const players = backfillCharacters([
      { name: "Alice", character: "turtle" },
      { name: "Bob" },
      { name: "Charlie", character: "hedgehog" },
      { name: "Dana" },
    ]);

    expect(players).toEqual([
      { name: "Alice", character: "turtle" },
      { name: "Bob", character: "squirrel" },
      { name: "Charlie", character: "hedgehog" },
      { name: "Dana", character: "mouse" },
    ]);
  });

  it("keeps backfilled characters unique within a game", () => {
    const players = backfillCharacters([
      { name: "Alice", character: "mouse" },
      { name: "Bob" },
      { name: "Charlie" },
      { name: "Dana" },
    ]) as { character: string }[];

    const characters = players.map((p) => p.character);

    expect(new Set(characters).size).toBe(4);
  });

  it("replaces a character value outside the catalogue", () => {
    const players = backfillCharacters([{ name: "Alice", character: "otter" }]);

    expect(players).toEqual([{ name: "Alice", character: "squirrel" }]);
  });

  it("passes through a player record that is not an object", () => {
    expect(backfillCharacters([null, "Alice"])).toEqual([null, "Alice"]);
  });
});

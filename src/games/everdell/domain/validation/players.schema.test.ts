import { describe, it, expect } from "vitest";
import { PlayersSchema } from "./players.schema";

describe("PlayersSchema uniqueness", () => {
  it("accepts unique names", () => {
    const result = PlayersSchema.safeParse({
      players: [
        { name: "Alice", character: "squirrel" },
        { name: "Bob", character: "turtle" },
        { name: "Charlie", character: "mouse" },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects exact duplicate names and annotates both entries", () => {
    const result = PlayersSchema.safeParse({
      players: [
        { name: "Alice", character: "squirrel" },
        { name: "Bob", character: "turtle" },
        { name: "Alice", character: "mouse" },
      ],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "name"]);
    expect(result.error?.issues[0].message).toContain(
      "Duplicate player name 'Alice'.",
    );
    expect(result.error?.issues[1].path).toEqual(["players", 2, "name"]);
    expect(result.error?.issues[1].message).toContain(
      "Duplicate player name 'Alice'.",
    );
  });

  it("rejects trimmed/case-insensitive duplicates", () => {
    const result = PlayersSchema.safeParse({
      players: [
        { name: " Alice ", character: "squirrel" },
        { name: "alice", character: "turtle" },
      ],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "name"]);
    expect(result.error?.issues[0].message).toContain("Duplicate player name");
    expect(result.error?.issues[1].path).toEqual(["players", 1, "name"]);
    expect(result.error?.issues[1].message).toContain("Duplicate player name");
  });

  it("should prevent creating a game with more players than allowed", () => {
    const result = PlayersSchema.safeParse({
      players: [
        { name: "Bruce Wayne", character: "squirrel" },
        { name: "Barry Allen", character: "turtle" },
        { name: "Clark Kent", character: "mouse" },
        { name: "Peter Parker", character: "hedgehog" },
        { name: "Matthew Murdock", character: "squirrel" },
      ],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues[0].code).toEqual("too_big");
    expect(result.error?.issues[0].message).toEqual("Max 4 players");
  });

  it("rejects two players sharing a character and annotates both slots", () => {
    const result = PlayersSchema.safeParse({
      players: [
        { name: "Alice", character: "squirrel" },
        { name: "Bob", character: "mouse" },
        { name: "Charlie", character: "squirrel" },
      ],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "character"]);
    expect(result.error?.issues[0].message).toEqual(
      "Each character can be used only once.",
    );
    expect(result.error?.issues[1].path).toEqual(["players", 2, "character"]);
    expect(result.error?.issues[1].message).toEqual(
      "Each character can be used only once.",
    );
  });

  it("reports a missing character against the slot it belongs to", () => {
    const result = PlayersSchema.safeParse({
      players: [{ name: "Alice", character: "" }],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "character"]);
    expect(result.error?.issues[0].message).toEqual("Required");
  });

  it("accepts a game with fewer players than the maximum", () => {
    const result = PlayersSchema.safeParse({
      players: [{ name: "Alice", character: "hedgehog" }],
    });

    expect(result.success).toBe(true);
  });
});

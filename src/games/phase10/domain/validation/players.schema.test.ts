import { describe, it, expect } from "vitest";
import { PlayersSchema } from "./players.schema";

describe("PlayersSchema uniqueness", () => {
  it("accepts unique names", () => {
    const result = PlayersSchema.safeParse({
      players: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects exact duplicate names and annotates both entries", () => {
    const result = PlayersSchema.safeParse({
      players: [{ name: "Alice" }, { name: "Bob" }, { name: "Alice" }],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "name"]);
    expect(result.error?.issues[0].message).toContain(
      "Duplicate player name 'Alice'."
    );
    expect(result.error?.issues[1].path).toEqual(["players", 2, "name"]);
    expect(result.error?.issues[1].message).toContain(
      "Duplicate player name 'Alice'."
    );
  });

  it("rejects trimmed/case-insensitive duplicates", () => {
    const result = PlayersSchema.safeParse({
      players: [{ name: " Alice " }, { name: "alice" }],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].path).toEqual(["players", 0, "name"]);
    expect(result.error?.issues[0].message).toContain("Duplicate player name");
    expect(result.error?.issues[1].path).toEqual(["players", 1, "name"]);
    expect(result.error?.issues[1].message).toContain("Duplicate player name");
  });
});

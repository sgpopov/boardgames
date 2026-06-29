import { describe, expect, it } from "vitest";
import { validatePlayers } from "./players.schema";

describe("ArkNova PlayersSchema", () => {
  it("accepts 1 to 4 uniquely named players", () => {
    const result = validatePlayers({
      players: [{ name: "Alice" }, { name: "Bob" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty player list", () => {
    const result = validatePlayers({ players: [] });

    expect(result.success).toBe(false);
  });

  it("rejects more than four players", () => {
    const result = validatePlayers({
      players: [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects blank names", () => {
    const result = validatePlayers({ players: [{ name: "" }] });

    expect(result.success).toBe(false);
  });

  it("flags duplicate names (case-insensitive, trimmed) on each duplicate field", () => {
    const result = validatePlayers({
      players: [{ name: "Bruce" }, { name: " bruce " }],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("players.0.name");
      expect(paths).toContain("players.1.name");
    }
  });
});

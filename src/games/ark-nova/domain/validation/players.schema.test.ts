import { describe, expect, it } from "vitest";
import { validatePlayers } from "./players.schema";

describe("ArkNova PlayersSchema", () => {
  it("accepts 1 to 4 uniquely named players with unique colors", () => {
    const result = validatePlayers({
      players: [
        { name: "Alice", color: "blue" },
        { name: "Bob", color: "yellow" },
      ],
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
        { name: "A", color: "blue" },
        { name: "B", color: "yellow" },
        { name: "C", color: "red" },
        { name: "D", color: "black" },
        { name: "E", color: "blue" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty names", () => {
    const result = validatePlayers({
      players: [{ name: "", color: "blue" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only names (matches submit-time trimming)", () => {
    const result = validatePlayers({
      players: [{ name: "   ", color: "blue" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing or invalid color", () => {
    const result = validatePlayers({
      players: [{ name: "Alice", color: "" }],
    });

    expect(result.success).toBe(false);
  });

  it("flags duplicate names (case-insensitive, trimmed) on each duplicate field", () => {
    const result = validatePlayers({
      players: [
        { name: "Bruce", color: "blue" },
        { name: " bruce ", color: "yellow" },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("players.0.name");
      expect(paths).toContain("players.1.name");
    }
  });

  it("flags duplicate colors on each duplicate field", () => {
    const result = validatePlayers({
      players: [
        { name: "Alice", color: "blue" },
        { name: "Bob", color: "blue" },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("players.0.color");
      expect(paths).toContain("players.1.color");
    }
  });
});

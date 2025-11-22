import { describe, it, expect } from "vitest";
import { getDuplicateNameGroups, hasDuplicateNames } from "./uniqueNames";

describe("uniqueNames validation", () => {
  it("returns no groups for unique names", () => {
    const players = [{ name: "Alice" }, { name: "Bob" }];
    expect(getDuplicateNameGroups(players)).toHaveLength(0);
    expect(hasDuplicateNames(players)).toBe(false);
  });

  it("detects simple duplicates", () => {
    const players = [{ name: "Alice" }, { name: "Bob" }, { name: "Alice" }];
    const groups = getDuplicateNameGroups(players);
    expect(groups).toHaveLength(1);
    expect(groups[0].indices).toEqual([0, 2]);
    expect(hasDuplicateNames(players)).toBe(true);
  });

  it("detects case-insensitive trimmed duplicates", () => {
    const players = [{ name: " Alice " }, { name: "alice" }, { name: "ALICE" }];
    const groups = getDuplicateNameGroups(players);
    expect(groups).toHaveLength(1);
    expect(groups[0].indices).toEqual([0, 1, 2]);
  });

  it("handles multiple distinct duplicate groups", () => {
    const players = [
      { name: "Alice" },
      { name: "Bob" },
      { name: "alice" },
      { name: "Charlie" },
      { name: "bob" },
    ];
    const groups = getDuplicateNameGroups(players);
    expect(groups).toHaveLength(2);
    const sorted = groups.map((g) => g.indices).sort((a, b) => a[0] - b[0]);
    expect(sorted).toEqual([
      [0, 2],
      [1, 4],
    ]);
  });
});

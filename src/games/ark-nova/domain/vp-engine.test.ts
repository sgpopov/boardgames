import { describe, expect, it } from "vitest";
import {
  alternativeVp,
  computeVictoryPoints,
  officialVp,
} from "./vp-engine";

describe("Ark Nova VP engine", () => {
  it("computes official VP from the threshold table", () => {
    // CP 20 → threshold 64
    expect(officialVp(100, 20)).toBe(36);
    expect(officialVp(64, 20)).toBe(0);
  });

  it("computes alternative VP from the bonus table", () => {
    // CP 20 → bonus 36
    expect(alternativeVp(100, 20)).toBe(136);
    // CP 18 → bonus 30
    expect(alternativeVp(10, 18)).toBe(40);
  });

  it("returns both VPs together", () => {
    expect(computeVictoryPoints(70, 22)).toEqual({
      officialVp: 70 - 58,
      alternativeVp: 70 + 42,
    });
  });

  it("yields negative official VP when appeal is below the threshold", () => {
    // low CP → high threshold
    expect(officialVp(10, 0)).toBe(10 - 113); // -103
    expect(officialVp(0, 7)).toBe(-100);
  });

  it("yields negative alternative VP when the bonus is negative (low CP)", () => {
    // CP 0 bonus is -14
    expect(alternativeVp(0, 0)).toBe(-14);
    expect(alternativeVp(5, 6)).toBe(3); // bonus -2
  });

  it("applies the CP-0 clamp (official threshold 113, not 114)", () => {
    expect(officialVp(113, 0)).toBe(0);
    // official and alternative differ by 99 (not 100) only at the CP-0 corner
    expect(alternativeVp(113, 0) - officialVp(113, 0)).toBe(99);
    // everywhere else the gap is exactly 100
    expect(alternativeVp(50, 25) - officialVp(50, 25)).toBe(100);
  });

  it("rejects out-of-range or non-integer inputs", () => {
    expect(() => officialVp(114, 10)).toThrow(RangeError);
    expect(() => officialVp(-1, 10)).toThrow(RangeError);
    expect(() => officialVp(50, 42)).toThrow(RangeError);
    expect(() => officialVp(50, -1)).toThrow(RangeError);
    expect(() => officialVp(50.5, 10)).toThrow(RangeError);
    expect(() => alternativeVp(50, 10.5)).toThrow(RangeError);
  });
});

import { describe, expect, it } from "vitest";
import { computeScorePreview } from "./scorePreview";

describe("computeScorePreview", () => {
  it("returns both VP totals for valid inputs", () => {
    expect(computeScorePreview("70", "22")).toEqual({
      officialVp: 12,
      alternativeVp: 112,
    });
  });

  it("handles zero values", () => {
    expect(computeScorePreview("0", "0")).toEqual({
      officialVp: -113,
      alternativeVp: -14,
    });
  });

  it("returns null while an input is empty", () => {
    expect(computeScorePreview("", "20")).toBeNull();
    expect(computeScorePreview("50", "")).toBeNull();
  });

  it("returns null for non-integer or out-of-range inputs", () => {
    expect(computeScorePreview("50.5", "20")).toBeNull();
    expect(computeScorePreview("200", "20")).toBeNull();
    expect(computeScorePreview("50", "42")).toBeNull();
    expect(computeScorePreview("-5", "20")).toBeNull();
    expect(computeScorePreview("abc", "20")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { validateAddScores } from "./add-scores.schema";

const valid = {
  players: [{ playerId: "p1", appeal: 50, conservationPoints: 20 }],
};

describe("Ark Nova AddScoresSchema", () => {
  it("accepts in-range integer appeal and conservation points", () => {
    expect(validateAddScores(valid).success).toBe(true);
  });

  it("accepts the boundary values", () => {
    expect(
      validateAddScores({
        players: [
          { playerId: "p1", appeal: 0, conservationPoints: 0 },
          { playerId: "p2", appeal: 113, conservationPoints: 41 },
        ],
      }).success,
    ).toBe(true);
  });

  it("rejects appeal above the maximum", () => {
    const result = validateAddScores({
      players: [{ playerId: "p1", appeal: 114, conservationPoints: 20 }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects conservation points above the maximum", () => {
    const result = validateAddScores({
      players: [{ playerId: "p1", appeal: 50, conservationPoints: 42 }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative values", () => {
    expect(
      validateAddScores({
        players: [{ playerId: "p1", appeal: -1, conservationPoints: 20 }],
      }).success,
    ).toBe(false);
  });

  it("rejects non-integer values", () => {
    expect(
      validateAddScores({
        players: [{ playerId: "p1", appeal: 50.5, conservationPoints: 20 }],
      }).success,
    ).toBe(false);
  });

  it("rejects an empty player list", () => {
    expect(validateAddScores({ players: [] }).success).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { AddRoundSchema } from "./rounds.schema";
import { PHASE_MIN, PHASE_MAX, SCORE_STEP } from "../constants";

describe("AddRoundSchema", () => {
  it("accepts valid player scores", () => {
    const result = AddRoundSchema.safeParse({
      players: [
        { id: "p1", phase: PHASE_MIN, score: 0 },
        { id: "p2", phase: PHASE_MAX, score: SCORE_STEP * 2 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty array", () => {
    const result = AddRoundSchema.safeParse({
      players: [],
    });

    expect(result.success).toBe(false);
  });

  it.each`
    phase            | expectedValidationRules
    ${PHASE_MIN - 1} | ${"too_small"}
    ${PHASE_MAX + 1} | ${"too_big"}
  `("should validate phase - $phase", ({ phase, expectedValidationRules }) => {
    const result = AddRoundSchema.safeParse({
      players: [{ id: "p1", phase: phase, score: 0 }],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).length(1);
    expect(result.error?.issues[0].code).toEqual(expectedValidationRules);
  });

  it("rejects non-divisible score", () => {
    const result = AddRoundSchema.safeParse({
      players: [{ id: "p1", phase: PHASE_MIN, score: SCORE_STEP + 1 }],
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).length(1);
    expect(result.error?.issues[0].message).toContain(
      "Score must be divisible by"
    );
  });
});

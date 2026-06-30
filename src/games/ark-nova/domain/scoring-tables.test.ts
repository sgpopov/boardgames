import { describe, expect, it } from "vitest";
import { ALTERNATIVE_BONUSES, OFFICIAL_THRESHOLDS } from "./scoring-tables";

describe("Ark Nova scoring tables", () => {
  it("encode CP 0–41 (42 entries each)", () => {
    expect(OFFICIAL_THRESHOLDS).toHaveLength(42);
    expect(ALTERNATIVE_BONUSES).toHaveLength(42);
  });

  it("match the documented official thresholds", () => {
    expect(OFFICIAL_THRESHOLDS[0]).toBe(113);
    expect(OFFICIAL_THRESHOLDS[20]).toBe(64);
    expect(OFFICIAL_THRESHOLDS[22]).toBe(58);
    expect(OFFICIAL_THRESHOLDS[23]).toBe(55);
    expect(OFFICIAL_THRESHOLDS[41]).toBe(1);
  });

  it("match the documented alternative bonuses", () => {
    expect(ALTERNATIVE_BONUSES[0]).toBe(-14);
    expect(ALTERNATIVE_BONUSES[15]).toBe(21);
    expect(ALTERNATIVE_BONUSES[16]).toBe(24);
    expect(ALTERNATIVE_BONUSES[17]).toBe(27);
    expect(ALTERNATIVE_BONUSES[18]).toBe(30);
  });

  it("satisfy threshold + bonus = 100 for every CP except the CP-0 clamp", () => {
    for (let cp = 0; cp <= 41; cp++) {
      const sum = OFFICIAL_THRESHOLDS[cp] + ALTERNATIVE_BONUSES[cp];

      if (cp === 0) {
        expect(sum).toBe(99); // board appeal capped at 113
      } else {
        expect(sum).toBe(100);
      }
    }
  });
});

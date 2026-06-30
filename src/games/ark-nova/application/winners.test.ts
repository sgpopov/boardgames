import { describe, expect, it } from "vitest";
import { computeWinners } from "@/games/ark-nova/application/winners";
import { ArkNovaPlayer } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { computeVictoryPoints } from "@/games/ark-nova/domain/vp-engine";

const makePlayer = (
  id: string,
  appeal: number,
  conservationPoints: number,
): ArkNovaPlayer => {
  const { officialVp, alternativeVp } = computeVictoryPoints(
    appeal,
    conservationPoints,
  );

  return {
    id,
    name: id,
    appeal,
    conservationPoints,
    officialVp,
    alternativeVp,
  };
};

describe("computeWinners", () => {
  it("picks the highest VP per method", () => {
    const players = [
      makePlayer("p1", 70, 22),
      makePlayer("p2", 50, 20),
    ];

    const winners = computeWinners(players);

    expect(winners.official).toEqual(["p1"]);
    expect(winners.alternative).toEqual(["p1"]);
  });

  it("breaks ties on higher appeal", () => {
    // Both reach the same official VP (appeal − threshold), but p1 has the
    // higher appeal so wins outright.
    const p1 = makePlayer("p1", 64, 20); // official VP 0
    const p2 = makePlayer("p2", 58, 22); // official VP 0
    expect(p1.officialVp).toBe(p2.officialVp);

    const winners = computeWinners([p2, p1]);

    expect(winners.official).toEqual(["p1"]);
  });

  it("returns joint winners when VP and appeal both tie", () => {
    const players = [
      makePlayer("p1", 60, 20),
      makePlayer("p2", 60, 20),
    ];

    const winners = computeWinners(players);

    expect(winners.official.sort()).toEqual(["p1", "p2"]);
    expect(winners.alternative.sort()).toEqual(["p1", "p2"]);
  });

  it("ignores unscored players", () => {
    const players: ArkNovaPlayer[] = [
      makePlayer("p1", 70, 22),
      {
        id: "p2",
        name: "p2",
        appeal: null,
        conservationPoints: null,
        officialVp: null,
        alternativeVp: null,
      },
    ];

    const winners = computeWinners(players);

    expect(winners.official).toEqual(["p1"]);
  });

  it("returns no winners when nobody is scored", () => {
    const players: ArkNovaPlayer[] = [
      {
        id: "p1",
        name: "p1",
        appeal: null,
        conservationPoints: null,
        officialVp: null,
        alternativeVp: null,
      },
    ];

    expect(computeWinners(players)).toEqual({ official: [], alternative: [] });
  });

  it("diverges between methods only at CP 0 (the board appeal clamp)", () => {
    // p1: CP 0 (clamp makes its alt VP one lower relative to the offset-100
    // pattern that holds for CP ≥ 1). p2: CP 7, appeal tuned so the two are
    // tied officially but p1 wins official on appeal, while p2 wins alternative.
    const p1 = makePlayer("p1", 100, 0); // official 100−113=−13, alt 100−14=86
    const p2 = makePlayer("p2", 87, 7); // official 87−100=−13, alt 87+0=87

    expect(p1.officialVp).toBe(p2.officialVp); // tie officially
    expect(p1.appeal! > p2.appeal!).toBe(true);

    const winners = computeWinners([p1, p2]);

    expect(winners.official).toEqual(["p1"]); // tie-break on higher appeal
    expect(winners.alternative).toEqual(["p2"]); // CP-0 clamp flips the result
  });
});

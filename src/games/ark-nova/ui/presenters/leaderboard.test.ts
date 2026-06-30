import { describe, expect, it } from "vitest";
import { buildLeaderboard } from "@/games/ark-nova/ui/presenters/leaderboard";
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

describe("buildLeaderboard", () => {
  it("sorts by the method's VP descending", () => {
    const players = [
      makePlayer("p1", 50, 20), // official 50−64 = −14
      makePlayer("p2", 70, 22), // official 70−58 = 12
    ];

    const rows = buildLeaderboard(players, "official", ["p2"]);

    expect(rows.map((row) => row.player.id)).toEqual(["p2", "p1"]);
    expect(rows[0].isWinner).toBe(true);
    expect(rows[1].isWinner).toBe(false);
  });

  it("breaks ties on higher appeal", () => {
    const p1 = makePlayer("p1", 64, 20); // official 0
    const p2 = makePlayer("p2", 58, 22); // official 0
    expect(p1.officialVp).toBe(p2.officialVp);

    const rows = buildLeaderboard([p2, p1], "official", ["p1"]);

    expect(rows.map((row) => row.player.id)).toEqual(["p1", "p2"]);
  });

  it("can order the two methods differently (CP-0 divergence)", () => {
    const p1 = makePlayer("p1", 100, 0); // official −13, alt 86
    const p2 = makePlayer("p2", 87, 7); // official −13, alt 87

    const official = buildLeaderboard([p2, p1], "official", ["p1"]);
    const alternative = buildLeaderboard([p1, p2], "alternative", ["p2"]);

    expect(official.map((row) => row.player.id)).toEqual(["p1", "p2"]);
    expect(alternative.map((row) => row.player.id)).toEqual(["p2", "p1"]);
  });

  it("places unscored players last", () => {
    const scored = makePlayer("p1", 70, 22);
    const unscored: ArkNovaPlayer = {
      id: "p2",
      name: "p2",
      appeal: null,
      conservationPoints: null,
      officialVp: null,
      alternativeVp: null,
    };

    const rows = buildLeaderboard([unscored, scored], "official", ["p1"]);

    expect(rows.map((row) => row.player.id)).toEqual(["p1", "p2"]);
    expect(rows[1].vp).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { getWinners, sortPlayersForCompletedGame } from "./getWinners";
import { makePlayer } from "../tests/helpers";
import { WINNER_PHASE } from "../domain/constants";

describe("getWinners", () => {
  it("returns empty when no player has reached winner phase", () => {
    const players = [makePlayer({ phase: 8 }), makePlayer({ phase: 9 })];
    expect(getWinners(players)).toEqual([]);
  });

  it("returns the single player who completed phase 10 with the lowest score", () => {
    const p1 = makePlayer({ id: "p1", phase: WINNER_PHASE, score: 50 });
    const p2 = makePlayer({ id: "p2", phase: WINNER_PHASE, score: 70 });
    const p3 = makePlayer({ id: "p3", phase: 9, score: 10 });

    const winners = getWinners([p1, p2, p3]);

    expect(winners).toHaveLength(1);
    expect(winners[0].id).toBe("p1");
  });

  it("returns all players tied on the lowest score as co-winners", () => {
    const p1 = makePlayer({ id: "p1", phase: WINNER_PHASE, score: 40 });
    const p2 = makePlayer({ id: "p2", phase: WINNER_PHASE, score: 40 });
    const p3 = makePlayer({ id: "p3", phase: WINNER_PHASE, score: 60 });

    const winners = getWinners([p1, p2, p3]);

    expect(winners).toHaveLength(2);
    expect(winners.map((w) => w.id)).toEqual(
      expect.arrayContaining(["p1", "p2"]),
    );
  });

  it("non-completed players are excluded from winner eligibility even with lower scores", () => {
    const p1 = makePlayer({ id: "p1", phase: WINNER_PHASE, score: 100 });
    const p2 = makePlayer({ id: "p2", phase: 9, score: 5 });

    const winners = getWinners([p1, p2]);

    expect(winners).toHaveLength(1);
    expect(winners[0].id).toBe("p1");
  });
});

describe("sortPlayersForCompletedGame", () => {
  it("places winners first", () => {
    const winner = makePlayer({ id: "w", phase: WINNER_PHASE, score: 50 });
    const other = makePlayer({ id: "o", phase: 8, score: 20 });

    const sorted = sortPlayersForCompletedGame([other, winner], [winner]);

    expect(sorted[0].id).toBe("w");
    expect(sorted[1].id).toBe("o");
  });

  it("sorts non-winners by phase descending then score ascending", () => {
    const winner = makePlayer({ id: "w", phase: WINNER_PHASE, score: 60 });
    const p1 = makePlayer({ id: "p1", phase: 8, score: 30 });
    const p2 = makePlayer({ id: "p2", phase: 9, score: 50 });
    const p3 = makePlayer({ id: "p3", phase: 9, score: 20 });

    const sorted = sortPlayersForCompletedGame([p1, p2, winner, p3], [winner]);

    expect(sorted[0].id).toBe("w");   // winner first
    expect(sorted[1].id).toBe("p3");  // phase 9, score 20
    expect(sorted[2].id).toBe("p2");  // phase 9, score 50
    expect(sorted[3].id).toBe("p1");  // phase 8
  });

  it("places all co-winners first when there is a tie", () => {
    const w1 = makePlayer({ id: "w1", phase: WINNER_PHASE, score: 40 });
    const w2 = makePlayer({ id: "w2", phase: WINNER_PHASE, score: 40 });
    const p1 = makePlayer({ id: "p1", phase: 7, score: 10 });

    const sorted = sortPlayersForCompletedGame([p1, w1, w2], [w1, w2]);

    expect(sorted[0].id).toMatch(/w[12]/);
    expect(sorted[1].id).toMatch(/w[12]/);
    expect(sorted[2].id).toBe("p1");
  });
});

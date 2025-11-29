import { describe, it, expect } from "vitest";
import { buildScoreRows } from "./buildScoreRows";

import type { EverdellGame, EverdellPlayer, GameModule } from "@games/everdell";

describe("buildScoreRows", () => {
  const players: EverdellPlayer[] = [
    {
      id: "p1",
      name: "Alice",
      scores: {
        base: {
          cards: 1,
          prosperity: 0,
          events: 2,
          journey: 3,
          tokens: 5,
        },
      },
      total: 10,
    },
    {
      id: "p2",
      name: "Bob",
      scores: {
        base: {
          cards: 1,
          prosperity: 2,
          events: 3,
          journey: 4,
          tokens: 5,
        },
      },
      total: 12,
    },
  ];

  const game: EverdellGame = {
    id: "game1",
    players,
    startedAt: new Date().toDateString(),
    completedAt: null,
  };

  const modules: GameModule[] = [
    {
      type: "base",
      components: [
        { key: "cards", title: "Cards", icon: "cards.png" },
        { key: "events", title: "Events", icon: "events.png" },
        { key: "prosperity", title: "Prosperity", icon: "prosperity.png" },
      ],
    },
  ];

  it("should map modules/components into score rows with correct keys and titles", () => {
    const rows = buildScoreRows(modules, game);

    expect(rows).toHaveLength(3);

    expect(rows[0].key).toBe("base_cards");
    expect(rows[0].title).toBe("Cards");
    expect(rows[0].icon).toBe("cards.png");

    expect(rows[1].key).toBe("base_events");
    expect(rows[1].title).toBe("Events");
    expect(rows[1].icon).toBe("events.png");

    expect(rows[2].key).toBe("base_prosperity");
    expect(rows[2].title).toBe("Prosperity");
    expect(rows[2].icon).toBe("prosperity.png");
  });

  it("should produce per-player score cells", () => {
    const rows = buildScoreRows(modules, game);

    expect(rows[0].scores).toHaveLength(2);

    // cards scores
    expect(rows[0].scores[0]).toMatchObject({
      key: "base_cards_p1",
      playerId: "p1",
      value: 1,
    });

    expect(rows[0].scores[1]).toMatchObject({
      key: "base_cards_p2",
      playerId: "p2",
      value: 1,
    });

    // events scores
    expect(rows[1].scores[0]).toMatchObject({
      key: "base_events_p1",
      value: 2,
    });

    expect(rows[1].scores[1]).toMatchObject({
      key: "base_events_p2",
      value: 3,
    });

    // prosperity scores
    expect(rows[2].scores[0]).toMatchObject({
      key: "base_prosperity_p1",
      value: 0,
    });

    expect(rows[2].scores[1]).toMatchObject({
      key: "base_prosperity_p2",
      value: 2,
    });
  });

  it("should handle empty modules by returning an empty array", () => {
    const rows = buildScoreRows([], game);

    expect(rows).toEqual([]);
  });

  it("should handle games with no players by returning empty scores per row", () => {
    const emptyGame = {
      id: "g2",
      players: [],
      startedAt: new Date().toDateString(),
      completedAt: null,
    };

    const rows = buildScoreRows(modules, emptyGame);

    expect(rows).toHaveLength(3);

    rows.forEach((row) => expect(row.scores).toEqual([]));
  });
});

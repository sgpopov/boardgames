import { CHARACTERS, isCharacter } from "@/games/everdell/domain/constants";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Games stored before Characters existed have players without one, and the
// storage mapper drops whatever fails its schema — so without this every such
// game would be silently deleted the first time the app loaded it. Called
// before parsing; knows nothing about storage or validation.
export function backfillCharacters(players: readonly unknown[]): unknown[] {
  const claimed = new Set(
    players
      .map((player) => (isRecord(player) ? player.character : undefined))
      .filter(isCharacter),
  );

  const available = CHARACTERS.filter((character) => !claimed.has(character));
  let nextAvailable = 0;

  return players.map((player, index) => {
    if (!isRecord(player) || isCharacter(player.character)) {
      return player;
    }

    // A game with more players than there are Characters cannot have unique
    // ones; catalogue order by index at least keeps the record loadable.
    const character =
      available[nextAvailable++] ?? CHARACTERS[index % CHARACTERS.length];

    return { ...player, character };
  });
}

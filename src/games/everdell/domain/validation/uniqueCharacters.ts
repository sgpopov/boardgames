import { Character } from "../constants";

export interface CharacterRecord {
  character: Character;
}

// Indices of every player sharing a character, grouped per character
// (length > 1). Mirrors getDuplicateNameGroups so both rules read alike.
export function getDuplicateCharacterGroups<T extends CharacterRecord>(
  players: T[],
): number[][] {
  const indicesByCharacter = new Map<Character, number[]>();

  players.forEach((player, idx) => {
    const indices = indicesByCharacter.get(player.character) ?? [];

    indices.push(idx);
    indicesByCharacter.set(player.character, indices);
  });

  return [...indicesByCharacter.values()].filter(
    (indices) => indices.length > 1,
  );
}

export function hasDuplicateCharacters<T extends CharacterRecord>(
  players: T[],
): boolean {
  return getDuplicateCharacterGroups(players).length > 0;
}

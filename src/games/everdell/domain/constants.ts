export const MAX_PLAYERS_ALLOWED = 4;

// The woodland creatures a player can be identified by, in the order they are
// offered. One per player slot (matches MAX_PLAYERS_ALLOWED), so a pre-filled
// default is always available. Purely an identity: no effect on scoring.
export const CHARACTERS = ["squirrel", "turtle", "mouse", "hedgehog"] as const;
export type Character = (typeof CHARACTERS)[number];

export function isCharacter(value: unknown): value is Character {
  return CHARACTERS.includes(value as Character);
}

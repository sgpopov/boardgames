export const MAX_PLAYERS_ALLOWED = 4;

// Raw input bounds (see PRD #29 "Architectural decisions"). Integers only.
export const MIN_APPEAL = 0;
export const MAX_APPEAL = 113;
export const MIN_CONSERVATION_POINTS = 0;
export const MAX_CONSERVATION_POINTS = 41;

// Official Ark Nova player pawn colors. One per player slot (matches
// MAX_PLAYERS_ALLOWED), picked manually at game creation and kept for the
// life of the game.
export const PLAYER_COLORS = ["blue", "yellow", "red", "black"] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];

// Decorative per-player icon, auto-assigned at random (independent of
// color) when the game is created, then persisted alongside the player.
export const ANIMAL_ICONS = ["bird", "fish", "rabbit", "turtle"] as const;
export type AnimalIcon = (typeof ANIMAL_ICONS)[number];

// Distinct accent per player slot (1–4), cycled if there are ever more.
// Shared so the scoring form and the results view colour each player the same.
export interface PlayerAccent {
  // Left-border accent for the player's slot.
  border: string;
  // Solid avatar background.
  avatar: string;
  // Numbered ranking dot in the score summary.
  dot: string;
  // VP accent text.
  vp: string;
}

export const PLAYER_ACCENTS: PlayerAccent[] = [
  {
    border: "border-l-emerald-600",
    avatar: "bg-emerald-600",
    dot: "bg-emerald-600",
    vp: "text-emerald-700",
  },
  {
    border: "border-l-blue-600",
    avatar: "bg-blue-600",
    dot: "bg-blue-600",
    vp: "text-blue-700",
  },
  {
    border: "border-l-violet-600",
    avatar: "bg-violet-600",
    dot: "bg-violet-600",
    vp: "text-violet-700",
  },
  {
    border: "border-l-orange-500",
    avatar: "bg-orange-500",
    dot: "bg-orange-500",
    vp: "text-orange-700",
  },
];

export function accentForIndex(index: number): PlayerAccent {
  return PLAYER_ACCENTS[index % PLAYER_ACCENTS.length];
}

export function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

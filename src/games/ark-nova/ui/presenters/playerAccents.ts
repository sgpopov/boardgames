// Single source of truth for how a player's chosen color is displayed.
// Shared by the create-game color picker, the scoring form, and the results
// view so a player's color always looks the same everywhere.
import { PlayerColor } from "@/games/ark-nova/domain/constants";

export interface PlayerAccent {
  label: string;
  // Left-border accent for the player's slot.
  border: string;
  // Solid avatar background.
  avatar: string;
  // Text color for the initial/label on top of the avatar background.
  avatarText: string;
  // Numbered ranking dot in the score summary.
  dot: string;
  // VP accent text.
  vp: string;
  // Small label chip background/text.
  chip: string;
  // Color swatch shown in the color picker.
  swatch: string;
}

export const PLAYER_ACCENTS: Record<PlayerColor, PlayerAccent> = {
  blue: {
    label: "Blue",
    border: "border-l-blue-600",
    avatar: "bg-blue-600",
    avatarText: "text-white",
    dot: "bg-blue-600",
    vp: "text-blue-700",
    chip: "bg-blue-100 text-blue-700",
    swatch: "bg-blue-600",
  },
  yellow: {
    label: "Yellow",
    border: "border-l-yellow-500",
    avatar: "bg-yellow-500",
    avatarText: "text-neutral-900",
    dot: "bg-yellow-500",
    vp: "text-yellow-700",
    chip: "bg-yellow-100 text-yellow-800",
    swatch: "bg-yellow-500",
  },
  red: {
    label: "Red",
    border: "border-l-red-600",
    avatar: "bg-red-600",
    avatarText: "text-white",
    dot: "bg-red-600",
    vp: "text-red-700",
    chip: "bg-red-100 text-red-700",
    swatch: "bg-red-600",
  },
  black: {
    label: "Black",
    border: "border-l-neutral-900",
    avatar: "bg-neutral-900",
    avatarText: "text-white",
    dot: "bg-neutral-900",
    vp: "text-neutral-900",
    chip: "bg-neutral-200 text-neutral-900",
    swatch: "bg-neutral-900",
  },
};

export function accentForColor(color: PlayerColor): PlayerAccent {
  return PLAYER_ACCENTS[color];
}

export function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

// Authoritative Ark Nova scoring tables, indexed by Conservation Points (CP) 0–41.
// Two independent rulebook lookups kept as explicit constants (see ADR 0001):
//   Official  : VP = appeal − OFFICIAL_THRESHOLDS[cp]   (printed rulebook)
//   Alternative: VP = appeal + ALTERNATIVE_BONUSES[cp]   ("New Scoring" rulebook)
//
// threshold(cp) + bonus(cp) = 100 for every CP except CP 0, where the board's
// appeal track is capped at 113 (so the threshold is 113, not the pattern's 114).

export const OFFICIAL_THRESHOLDS: readonly number[] = [
  113, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 91, 88, 85, 82, 79, 76,
  73, 70, 67, 64, 61, 58, 55, 52, 49, 46, 43, 40, 37, 34, 31, 28, 25, 22, 19,
  16, 13, 10, 7, 4, 1,
];

export const ALTERNATIVE_BONUSES: readonly number[] = [
  -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33,
  36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90,
  93, 96, 99,
];

export interface NameRecord {
  name: string;
}

export interface DuplicateGroup {
  canonical: string; // normalized (trimmed, lowercased)
  indices: number[]; // all indices where duplicate occurs (length > 1)
  firstOriginal: string; // original first occurrence name
}

// Returns groups of duplicate names (case-insensitive, trimmed)
export function getDuplicateNameGroups<T extends NameRecord>(
  players: T[]
): DuplicateGroup[] {
  const map = new Map<string, { indices: number[]; firstOriginal: string }>();
  players.forEach((p, idx) => {
    const normalized = p.name.trim().toLowerCase();
    if (!map.has(normalized)) {
      map.set(normalized, { indices: [idx], firstOriginal: p.name });
    } else {
      map.get(normalized)!.indices.push(idx);
    }
  });
  const groups: DuplicateGroup[] = [];
  for (const [canonical, info] of map.entries()) {
    if (info.indices.length > 1) {
      groups.push({
        canonical,
        indices: info.indices,
        firstOriginal: info.firstOriginal,
      });
    }
  }
  return groups;
}

export function hasDuplicateNames<T extends NameRecord>(players: T[]): boolean {
  return getDuplicateNameGroups(players).length > 0;
}

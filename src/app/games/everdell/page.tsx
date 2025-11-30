"use client";

import { ListEverdellGames } from "@games/everdell";

export default function EverdellListPage() {
  return (
    <div className="p-5 space-y-4">
      <ListEverdellGames />
    </div>
  );
}

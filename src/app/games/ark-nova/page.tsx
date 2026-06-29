"use client";

import { ListArkNovaGames } from "@games/ark-nova/ui/components/ListGames";

export default function ArkNovaListPage() {
  return (
    <div className="p-5 space-y-4">
      <ListArkNovaGames />
    </div>
  );
}

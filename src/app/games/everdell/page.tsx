"use client";

import { useEffect, useState } from "react";
import { DicesIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export default function Phase10Page() {
  const [games, setGames] = useState([]);
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setGames([]);
      setGamesLoaded(true);
    }, 1000);
  }, []);

  if (!gamesLoaded) {
    return <div>Loading games...</div>;
  }

  if (!games.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DicesIcon />
          </EmptyMedia>
          <EmptyTitle>No games found</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any games yet. Get started by creating your
            first game.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <div>Soon</div>;
}

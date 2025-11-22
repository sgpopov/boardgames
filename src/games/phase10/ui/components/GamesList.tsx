"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Phase10Game } from "../../application/entities/Phase10Game";

type GamesListProps = {
  games: Phase10Game[];
};

function GamesList({ games }: GamesListProps) {
  console.log("games", games);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Games ({games.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1">
          {games.map((g: Phase10Game) => (
            <li key={g.id}>
              <Link href={`/games/phase10/${g.id}`} className="underline">
                {g.players[0].name} - Score {g.players[0].score} Phase{" "}
                {g.players[0].phase}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { GamesList };

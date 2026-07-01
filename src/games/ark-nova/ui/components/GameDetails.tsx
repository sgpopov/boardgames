"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheckIcon,
  ChevronRight,
  Clock3Icon,
  Crown,
  Leaf,
  MoreVerticalIcon,
  SquarePen,
  Star,
  Trees,
  TrophyIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArkNovaPlayer } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { ScoringMethod } from "@/games/ark-nova/application/winners";
import { useGameDetails } from "@/games/ark-nova/ui/hooks/useGameDetails";
import { useCompleteGame } from "@/games/ark-nova/ui/hooks/useCompleteGame";
import {
  buildLeaderboard,
  LeaderboardRow,
} from "@/games/ark-nova/ui/presenters/leaderboard";
import {
  accentForColor,
  initialFor,
  PlayerAccent,
} from "@/games/ark-nova/ui/presenters/playerAccents";

type GameDetailsProps = {
  gameId: string;
};

const METHODS: { key: ScoringMethod; label: string }[] = [
  { key: "official", label: "Official VP" },
  { key: "alternative", label: "Alternative VP" },
];

const METHOD_LABEL: Record<ScoringMethod, string> = {
  official: "Official VP",
  alternative: "Alternative VP",
};

function formatNumber(value: number | null): string {
  return value === null ? "—" : String(value);
}

function isScored(player: ArkNovaPlayer): boolean {
  return player.appeal !== null && player.conservationPoints !== null;
}

function formatCompletedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Small decorative confetti specks for the winner banner.
const CONFETTI = [
  { left: "8%", top: "26%", rotate: "-18deg", color: "bg-emerald-400" },
  { left: "20%", top: "60%", rotate: "12deg", color: "bg-blue-400" },
  { left: "30%", top: "18%", rotate: "40deg", color: "bg-amber-400" },
  { left: "46%", top: "30%", rotate: "-25deg", color: "bg-violet-400" },
  { left: "64%", top: "20%", rotate: "18deg", color: "bg-rose-300" },
  { left: "78%", top: "56%", rotate: "-10deg", color: "bg-orange-400" },
  { left: "90%", top: "30%", rotate: "24deg", color: "bg-blue-400" },
  { left: "84%", top: "70%", rotate: "-30deg", color: "bg-emerald-400" },
];

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border bg-white/70 px-3 py-1.5 text-sm">
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{formatNumber(value)}</span>
    </span>
  );
}

function WinnerBanner({
  names,
  vp,
  appeal,
  conservationPoints,
}: {
  names: string;
  vp: number | null;
  appeal: number | null;
  conservationPoints: number | null;
}) {
  return (
    <Card className="relative overflow-hidden border-emerald-200 bg-emerald-50/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={cn(
              "absolute h-2 w-1.5 rounded-[1px] opacity-70",
              c.color,
            )}
            style={{ left: c.left, top: c.top, transform: `rotate(${c.rotate})` }}
          />
        ))}
      </div>

      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full ring-2 ring-emerald-300/70">
            <TrophyIcon className="size-8 text-emerald-700" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">Winner</p>
            <p className="truncate text-2xl font-bold text-emerald-700">
              {names}
            </p>
          </div>

          <div className="text-right">
            <p className="flex items-baseline justify-end gap-1.5">
              <span className="text-3xl font-bold text-emerald-700 tabular-nums">
                {formatNumber(vp)}
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                VP
              </span>
            </p>
            <p className="flex items-center justify-end gap-1 text-sm font-semibold text-emerald-700">
              <Star
                className="size-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              WINNER
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <StatChip
            icon={<Leaf className="size-4 text-emerald-600" aria-hidden="true" />}
            label="Appeal"
            value={appeal}
          />
          <StatChip
            icon={
              <Trees className="size-4 text-emerald-600" aria-hidden="true" />
            }
            label="Conservation"
            value={conservationPoints}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MethodTabs({
  method,
  onChange,
}: {
  method: ScoringMethod;
  onChange: (method: ScoringMethod) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Scoring method"
      className="flex w-full gap-1 rounded-xl border bg-muted/60 p-1"
    >
      {METHODS.map(({ key, label }) => {
        const selected = key === method;

        return (
          <button
            key={key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              selected
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PlayerRow({
  row,
  rank,
  accent,
  method,
  isCompleted,
  expanded,
  onToggle,
}: {
  row: LeaderboardRow;
  rank: number;
  accent: PlayerAccent;
  method: ScoringMethod;
  isCompleted: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const winner = row.isWinner && isCompleted;
  const otherMethod: ScoringMethod =
    method === "official" ? "alternative" : "official";
  const otherVp =
    otherMethod === "official"
      ? row.player.officialVp
      : row.player.alternativeVp;

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40",
          winner && "border-l-4 border-l-emerald-600 bg-emerald-50/50",
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums text-muted-foreground">
          {rank}
        </span>

        <span className="relative inline-flex shrink-0">
          {winner && (
            <Crown
              className="absolute -top-3 left-1/2 size-4 -translate-x-1/2 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-base font-semibold",
              accent.avatar,
              accent.avatarText,
            )}
          >
            {initialFor(row.player.name)}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-semibold">
            <span className="truncate">{row.player.name}</span>
            {winner && <span className="sr-only">Winner</span>}
          </span>
          <span className="mt-1 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs">
              <Leaf className="size-3 text-emerald-600" aria-hidden="true" />
              <span className="tabular-nums">
                {formatNumber(row.player.appeal)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs">
              <Trees className="size-3 text-emerald-600" aria-hidden="true" />
              <span className="tabular-nums">
                {formatNumber(row.player.conservationPoints)}
              </span>
            </span>
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-2xl font-bold tabular-nums",
              winner ? "text-emerald-700" : "text-foreground",
            )}
          >
            {formatNumber(row.vp)}
          </span>
          {row.vp !== null && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              VP
            </span>
          )}
        </span>

        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90",
          )}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="mx-3 rounded-b-xl border border-t-0 bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {METHOD_LABEL[otherMethod]}:
          </span>{" "}
          <span className="tabular-nums">{formatNumber(otherVp)}</span>
        </div>
      )}
    </li>
  );
}

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching, setGame } = useGameDetails(props.gameId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [method, setMethod] = useState<ScoringMethod>("official");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { complete, isCompleting, error } = useCompleteGame({
    gameId: props.gameId,
    onCompleted: setGame,
  });

  if (isFetching) {
    return <div className="p-5">Loading...</div>;
  }

  if (!game) {
    return <div className="p-5">Game not found</div>;
  }

  const isCompleted = !!game.completedAt;
  const allScored = game.players.every(isScored);
  const anyScored = game.players.some(isScored);

  // Each player keeps their own chosen color, regardless of rank.
  const accentByPlayerId = new Map(
    game.players.map((player) => [player.id, accentForColor(player.color)]),
  );

  const winners = game.winners ?? { official: [], alternative: [] };
  const rows = buildLeaderboard(game.players, method, winners[method]);
  const winnerRows = rows.filter((row) => row.isWinner);
  const winnerNames = winnerRows.map((row) => row.player.name).join(" & ");
  const topWinner = winnerRows[0]?.player ?? null;

  return (
    <div className="lg:mt-5 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-5 pb-24">
      <h1 className="sr-only">
        {isCompleted ? "Ark Nova game results" : "Ark Nova game scores"}
      </h1>

      {/* Status */}
      <Card>
        <CardContent className="flex items-center gap-3" aria-live="polite">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              isCompleted ? "bg-emerald-100" : "bg-amber-100",
            )}
          >
            {isCompleted ? (
              <BadgeCheckIcon
                className="size-5 text-emerald-700"
                aria-hidden="true"
              />
            ) : (
              <Clock3Icon className="size-5 text-amber-700" aria-hidden="true" />
            )}
          </span>

          <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-0.5">
            <span className="font-semibold">
              <span className="sr-only">Status: </span>
              {isCompleted ? "Completed" : "In progress"}
            </span>
            {game.completedAt && (
              <span className="border-l pl-3 text-sm text-muted-foreground">
                {formatCompletedAt(game.completedAt)}
              </span>
            )}
          </div>

          {!isCompleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Game actions">
                  <MoreVerticalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={routes.arkNova.score(game.id)}>
                    {anyScored ? "Edit scores" : "Enter scores"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!allScored}
                  onSelect={() => setConfirmOpen(true)}
                >
                  Complete game
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Winner banner */}
      {isCompleted && winnerNames && (
        <WinnerBanner
          names={winnerNames}
          vp={winnerRows[0]?.vp ?? null}
          appeal={topWinner?.appeal ?? null}
          conservationPoints={topWinner?.conservationPoints ?? null}
        />
      )}

      {/* Method tabs */}
      <MethodTabs method={method} onChange={setMethod} />

      {/* Ranked players */}
      {!isCompleted && !allScored && (
        <p className="text-sm text-muted-foreground">
          Enter appeal and conservation points for every player, then complete
          the game to see the final results.
        </p>
      )}

      <ol className="space-y-3">
        {rows.map((row, index) => (
          <PlayerRow
            key={row.player.id}
            row={row}
            rank={index + 1}
            accent={
              accentByPlayerId.get(row.player.id) ??
              accentForColor(row.player.color)
            }
            method={method}
            isCompleted={isCompleted}
            expanded={expandedId === row.player.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === row.player.id ? null : row.player.id,
              )
            }
          />
        ))}
      </ol>

      {/* Actions */}
      {!isCompleted && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link href={routes.arkNova.score(game.id)}>
              <SquarePen className="size-4" aria-hidden="true" />
              {anyScored ? "Edit scores" : "Enter scores"}
            </Link>
          </Button>
          <Button
            className="flex-1"
            disabled={!allScored || isCompleting}
            onClick={() => setConfirmOpen(true)}
          >
            Complete game
          </Button>
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This locks the scores and reveals the final leaderboards. You
              won&apos;t be able to edit scores afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                complete();
              }}
              disabled={isCompleting}
            >
              {isCompleting ? "Completing..." : "Complete game"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GameDetails;

import Image from "next/image";
import { cva } from "class-variance-authority";
import { artForCharacter } from "@/games/everdell/ui/presenters/characterArt";
import { PodiumRow } from "@/games/everdell/ui/presenters/buildPodium";
import forestBackground from "@games/everdell/assets/forest.png";
import woodStand from "@games/everdell/assets/wood-stand-2.png";

const medalBadgeVariants = cva(
  "absolute top-5 left-1/2 flex size-4 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold shadow",
  {
    variants: {
      medal: {
        gold: "bg-amber-400 text-amber-950 ring-1 ring-amber-500",
        silver: "bg-slate-300 text-slate-900 ring-1 ring-slate-400",
        bronze: "bg-orange-700 text-orange-50 ring-1 ring-orange-800",
        fourth: "bg-slate-600 text-slate-50 ring-1 ring-slate-700",
      },
    },
  },
);

type PodiumSceneProps = {
  rows: PodiumRow[];
};

export function PodiumScene({ rows }: PodiumSceneProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section aria-label="Podium" className="relative isolate overflow-hidden">
      {/* Base gradient - always renders, even if the forest image below fails to load. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-sky-100 via-emerald-50 to-emerald-100"
      />
      {/* Plain CSS background-image rather than next/image: a failed load just
          leaves the gradient above visible, with no broken-image glyph. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-125 bg-cover bg-center"
        style={{ backgroundImage: `url(${forestBackground.src})` }}
      />

      <ul className="relative flex items-start justify-center gap-3 px-4 pt-10 pb-4 sm:gap-4">
        {rows.map((row) => (
          <PodiumStump key={row.player.id} row={row} />
        ))}
      </ul>
    </section>
  );
}

function PodiumStump({ row }: { row: PodiumRow }) {
  const art = artForCharacter(row.player.character);
  const characterImage = row.isWinner ? art.trophyArt : art.art;
  const accessibleLabel = `${row.player.name} — rank ${row.rank}, total ${row.total}${
    row.isWinner ? ", winner" : ""
  }`;

  return (
    <li className="flex flex-col items-center">
      <div className="flex flex-col items-center align-bottom">
        <span
          aria-hidden="true"
          className="rounded-full bg-amber-900/55 px-2 py-0.5 text-lg font-bold text-white shadow-[0_0_14px_rgba(120,72,24,0.65)] ring-1 ring-amber-700/45 backdrop-blur-[1px]"
        >
          {row.player.name[0]}
        </span>

        <div className="relative mt-2 z-1 h-16 w-14" aria-hidden="true">
          <Image
            src={characterImage}
            alt=""
            fill
            sizes="56px"
            className="object-contain object-bottom"
          />
        </div>

        <div className="relative -mt-4  h-14 w-16" aria-hidden="true">
          <Image
            src={woodStand}
            alt=""
            fill
            sizes="64px"
            className="object-contain"
          />
          <span className={medalBadgeVariants({ medal: row.medal })}>
            {row.rank}
          </span>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="rounded-full bg-amber-900/55 px-2 py-0.5 text-xl font-extrabold text-white shadow-[0_0_14px_rgba(120,72,24,0.65)] ring-1 ring-amber-700/45 backdrop-blur-[1px]"
      >
        {row.total}
      </span>

      <span className="sr-only">{accessibleLabel}</span>
    </li>
  );
}

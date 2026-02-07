import Link from "next/link";
import { GAME_MODULES } from "../games/registry";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-2xl lg:mx-0 mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          Tally
        </h1>
        <p className="mt-2 text-lg/8 text-gray-600">
          A companion app for board games
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_MODULES.map((m) => (
          <li key={m.id} className="border rounded p-4 bg-white shadow-sm">
            <Link href={m.route}>
              <h2 className="text-xl font-medium mb-2">{m.name}</h2>
              <Image src={m.image} alt={m.name} className="h-[45px]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { GAME_MODULES } from "../games/registry";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-3xl font-semibold mb-6">Board Game Companion</h1>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_MODULES.map((m) => (
          <li
            key={m.id}
            className="border rounded p-4 bg-white dark:bg-zinc-900 shadow-sm"
          >
            <Link href={m.route} >
              <h2 className="text-xl font-medium mb-2">{m.name}</h2>
              <Image src={m.image} alt={m.name} className=" h-45" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

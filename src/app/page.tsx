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

      <ul
        role="list"
        className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
      >
        {GAME_MODULES.map((m) => (
          <li key={m.id} className="relative flex space-x-6 py-6">
            <Image
              src={m.image}
              alt="Model wearing men&#039;s charcoal basic tee in large."
              className="size-24 flex-none rounded-md bg-gray-100 object-cover object-center"
            />
            <div className="flex-auto space-y-1">
              <h2 className="text-xl text-gray-900">
                <Link href={m.route}>
                  <span className="absolute inset-0" />
                  {m.name}
                </Link>
              </h2>
              <p>{m.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

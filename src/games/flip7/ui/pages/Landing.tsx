"use client";

import { GamesList } from "../components/GamesList";

export default function Landing() {
  return (
    <>
      <main id="main" className="min-h-screen p-6">
        <section aria-labelledby="games-list">
          <GamesList />
        </section>
      </main>
    </>
  );
}

"use client";

import { GamesList } from "../components/GamesList";

export default function Landing() {
  return (
    <>
      <section className="min-h-screen p-6" aria-labelledby="games-list">
        <GamesList />
      </section>
    </>
  );
}

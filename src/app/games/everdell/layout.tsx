import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@games/everdell/assets/logo.png";
import { routes } from "@/app/routes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Everdell",
  description: "Everdell companion scoring app",
};

export default function EverdellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-everdell>
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
          <Link
            href={routes.everdell.list()}
            className="flex items-center gap-5 no-underline"
          >
            <Image
              src={logo}
              alt="Everdell"
              className="h-10 w-auto"
              loading="eager"
            />
          </Link>
          <Link
            href={routes.everdell.newGame()}
            className="text-sm underline self-center"
          >
            <Button className="bg-orange-900">Create new game</Button>
          </Link>
        </nav>
      </header>
      <main className="lg:mt-5 mx-auto max-w-7xl">
        <div>
          <Suspense>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}

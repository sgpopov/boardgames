import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/app/routes";
import logo from "@games/flip7/ui/assets/logo.png";
import { Button } from "@/components/ui/button";
import { CircleQuestionMarkIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Flip 7 scoring app",
  description:
    "An elegant and intuitive score-tracking app designed for Flip7 board game. Perfect for family game nights, friendly competitions, and casual gaming sessions!",
};

export default function Flip7Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-5">
        <nav className="mx-auto flex items-center justify-between">
          <Link
            href={routes.flip7.list()}
            className="flex items-center gap-5 no-underline"
          >
            <Image src={logo} alt="Flip 7" className="h-14 w-auto" />
          </Link>
          <Link
            href={routes.flip7.faq()}
            className="text-sm underline self-center"
          >
            <Button variant="secondary" size="sm" aria-label="Score round">
              <CircleQuestionMarkIcon />
              FAQ
            </Button>
          </Link>
        </nav>
      </header>
      <main>
        <Suspense>{children}</Suspense>
      </main>
    </>
  );
}

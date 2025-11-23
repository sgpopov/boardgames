import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@games/phase10/ui/logo-small.jpeg";
import { routes } from "@/app/routes";

export const metadata: Metadata = {
  title: "Phase 10",
  description: "Phase 10 companion scoring app",
};

export default function Phase10Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-5">
        <Link
          href={routes.phase10.list()}
          className="flex items-center gap-5 no-underline"
        >
          <Image src={logo} alt="Phase 10" className="h-10 w-auto" />

          <h1 className="text-2xl font-semibold">Phase 10</h1>
        </Link>
      </header>
      <main>
        <Suspense>{children}</Suspense>
      </main>
    </>
  );
}

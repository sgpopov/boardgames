import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@games/ark-nova/assets/banner.jpg";
import { routes } from "@/app/routes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Ark Nova",
  description:
    "Ark Nova companion scoring app — track appeal, conservation points and victory points for your zoo.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ark Nova Scoring Companion",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description:
    "Track appeal, conservation points and dual victory-point scoring for your Ark Nova games.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ArkNovaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-ark-nova>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
          <Link
            href={routes.arkNova.list()}
            className="flex items-center gap-5 no-underline"
          >
            <Image
              src={logo}
              alt=""
              className="h-10 w-auto rounded"
              loading="eager"
            />
            <span className="text-2xl font-semibold">Ark Nova</span>
          </Link>
          <Button asChild className="self-center">
            <Link href={routes.arkNova.newGame()}>Create new game</Link>
          </Button>
        </nav>
      </header>
      <main id="main-content" className="lg:mt-5 mx-auto max-w-7xl">
        <div>
          <Suspense>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}

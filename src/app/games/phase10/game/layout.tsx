import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Details | Phase 10",
  description: "View scores and progress for your Phase 10 game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Game | Phase 10",
  description: "Create a new Phase 10 game and add your players.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

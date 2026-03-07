import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Details | Flip 7",
  description: "View scores and game progress for your Flip 7 game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

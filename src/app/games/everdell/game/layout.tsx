import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Details | Everdell",
  description: "View scores and progress for your Everdell game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

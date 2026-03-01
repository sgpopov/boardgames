import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Game | Flip 7",
  description: "Create a new Flip 7 game and add your players.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

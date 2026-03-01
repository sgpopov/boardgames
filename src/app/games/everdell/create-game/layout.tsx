import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Game | Everdell",
  description: "Create a new Everdell game and add your players.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Game | Ark Nova",
  description: "Create a new Ark Nova game and add your players.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

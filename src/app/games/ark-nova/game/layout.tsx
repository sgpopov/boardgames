import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Details | Ark Nova",
  description: "View players and progress for your Ark Nova game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

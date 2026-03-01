import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Round Score | Flip 7",
  description: "Record scores for the current round in your Flip 7 game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

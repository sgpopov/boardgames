import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Round | Phase 10",
  description: "Record scores for the current round in your Phase 10 game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

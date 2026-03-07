import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Scores | Everdell",
  description: "Record scores for a scoring category in your Everdell game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

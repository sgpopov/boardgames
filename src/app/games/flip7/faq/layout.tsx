import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Flip 7",
  description: "Frequently asked questions about the Flip 7 board game rules and scoring.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

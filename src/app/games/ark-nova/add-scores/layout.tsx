import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Scoring | Ark Nova",
  description:
    "Enter appeal and conservation points to compute victory points for your Ark Nova game.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { StaticImageData } from "next/image";
import { routes } from "@/app/routes";
import phase10Logo from "./phase10/ui/logo.jpg";
import everdellBanner from "@games/everdell/assets/banner.jpg";
import flip7banner from "@games/flip7/ui/assets/banner.png";

export interface GameModuleDescriptor {
  id: string;
  name: string;
  description: string;
  image: string | StaticImageData;
  route: string;
}

export const GAME_MODULES: GameModuleDescriptor[] = [
  {
    id: "phase10",
    name: "Phase 10",
    description:
      "Collect sets and runs before your opponents to advance through ten phases of play.",
    image: phase10Logo,
    route: routes.phase10.list(),
  },
  {
    id: "everdell",
    name: "Everdell",
    description:
      "Gather resources to develop a harmonious village of woodland critters and structures",
    image: everdellBanner,
    route: routes.everdell.list(),
  },
  {
    id: "flip7",
    name: "Flip 7",
    description:
      "Score the cards in front of you, or take another card, risking everything you hold?",
    image: flip7banner,
    route: routes.flip7.list(),
  },
];

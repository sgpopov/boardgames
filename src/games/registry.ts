import { StaticImageData } from "next/image";
import { routes } from "@/app/routes";
import phase10Logo from "./phase10/ui/logo.jpg";
import everdellBanner from "@games/everdell/assets/banner.jpg";

export interface GameModuleDescriptor {
  id: string;
  name: string;
  image: string | StaticImageData;
  route: string;
}

export const GAME_MODULES: GameModuleDescriptor[] = [
  {
    id: "phase10",
    name: "Phase 10",
    image: phase10Logo,
    route: routes.phase10.list(),
  },
  {
    id: "everdell",
    name: "Everdell",
    image: everdellBanner,
    route: routes.everdell.list(),
  },
];

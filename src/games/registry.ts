import { StaticImageData } from "next/image";
import phase10Logo from "./phase10/ui/logo.jpg";
import { routes } from "@/app/routes";

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
];

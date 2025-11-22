import { StaticImageData } from "next/image";
import phase10Logo from "./phase10/ui/logo.jpg";

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
    route: "/games/phase10",
  },
];

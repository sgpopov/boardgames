import { StaticImageData } from "next/image";

export type ModuleComponent = {
  key: string;
  title: string;
  icon: string | StaticImageData;
};

export type GameModule = {
  type: "base";
  components: ModuleComponent[];
};

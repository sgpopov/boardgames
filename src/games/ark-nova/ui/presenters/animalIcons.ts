import { Bird, Fish, Rabbit, Turtle, type LucideIcon } from "lucide-react";
import { AnimalIcon } from "@/games/ark-nova/domain/constants";

const ANIMAL_ICON_COMPONENTS: Record<AnimalIcon, LucideIcon> = {
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  turtle: Turtle,
};

export function animalIconFor(icon: AnimalIcon): LucideIcon {
  return ANIMAL_ICON_COMPONENTS[icon];
}

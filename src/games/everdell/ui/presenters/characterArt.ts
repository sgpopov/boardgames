// The only module that knows what a Character looks like. Swapping or adding
// artwork touches this file and nothing else; the domain never learns.
import { StaticImageData } from "next/image";
import { Character } from "@/games/everdell/domain/constants";

// Next types SVG imports as `any`; the annotation below pins them back down.
import squirrel from "@games/everdell/assets/characters/squirrel.svg";
import turtle from "@games/everdell/assets/characters/turtle.svg";
import mouse from "@games/everdell/assets/characters/mouse.svg";
import hedgehog from "@games/everdell/assets/characters/hedgehog.svg";

export interface CharacterArt {
  label: string;
  art: StaticImageData;
}

const CHARACTER_ART: Record<Character, CharacterArt> = {
  squirrel: { label: "Squirrel", art: squirrel },
  turtle: { label: "Turtle", art: turtle },
  mouse: { label: "Mouse", art: mouse },
  hedgehog: { label: "Hedgehog", art: hedgehog },
};

export function artForCharacter(character: Character): CharacterArt {
  return CHARACTER_ART[character];
}

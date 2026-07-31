// The only module that knows what a Character looks like. Swapping or adding
// artwork touches this file and nothing else; the domain never learns.
import { StaticImageData } from "next/image";
import { Character } from "@/games/everdell/domain/constants";

import squirrel from "@games/everdell/assets/characters/squirrel-no-trophy.png";
import turtle from "@games/everdell/assets/characters/turtle-no-trophy.png";
import mouse from "@games/everdell/assets/characters/mouse-no-trophy.png";
import hedgehog from "@games/everdell/assets/characters/hedgehog-no-trophy.png";
import squirrelTrophy from "@games/everdell/assets/characters/squirrel-with-trophy.png";
import turtleTrophy from "@games/everdell/assets/characters/turtle-with-trophy.png";
import mouseTrophy from "@games/everdell/assets/characters/mouse-with-trophy.png";
import hedgehogTrophy from "@games/everdell/assets/characters/hedgehog-with-trophy.png";

export interface CharacterArt {
  label: string;
  art: StaticImageData;
  trophyArt: StaticImageData;
}

const CHARACTER_ART: Record<Character, CharacterArt> = {
  squirrel: { label: "Squirrel", art: squirrel, trophyArt: squirrelTrophy },
  turtle: { label: "Turtle", art: turtle, trophyArt: turtleTrophy },
  mouse: { label: "Mouse", art: mouse, trophyArt: mouseTrophy },
  hedgehog: { label: "Hedgehog", art: hedgehog, trophyArt: hedgehogTrophy },
};

export function artForCharacter(character: Character): CharacterArt {
  return CHARACTER_ART[character];
}

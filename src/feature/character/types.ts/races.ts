import { AbilityBonus } from "./abilityScore";
import { Proficiency } from "./proficiencies";

export type Race = {
  name: string;
  ability_bonuses: [
    ability_score: AbilityBonus
  ];
  alignment: string;
  age: string;
  size_description: string;
  starting_proficiencies: Proficiency[];
};
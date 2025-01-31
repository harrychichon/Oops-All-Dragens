import { AbilityScore } from "../../../constants/constants";
import { Proficiency } from "./proficiencies";

export type Race = {
  name: string;
  ability_bonuses: [
    {
      ability_score: {
        name: AbilityScore;
      };
      bonus: number;
    }
  ];
  alignment: string;
  age: string;
  size_description: string;
  starting_proficiencies: Proficiency[];
};

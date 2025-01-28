import { AbilityScore } from "./abilityScores";
import { Monster } from "./monsters";

export type SearchableCategories = keyof Monster;

export type SearchResult = {
  count: number;
  results: Array<{
    index: string;
    name: string;
    url: string;
  }>;
};

export type DifficultyClass = {
  dcType: AbilityScore;
  dcValue: number;
  successType?: string;
};

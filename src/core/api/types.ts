import { Monster } from "../../feature/cards/monsters/monsters";
export type SearchableCategories = keyof Monster;

export type SearchResult = {
  count: number;
  results: Array<{
    index: string;
    name: string;
    url: string;
  }>;
};

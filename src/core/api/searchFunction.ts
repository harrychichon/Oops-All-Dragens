import { baseUrl, endpoints } from "./api.ts";
import { SearchResult, SearchableCategories } from "./types.ts";
import { fetchApi } from "./fetchFunctions.ts";



//===============================================================================
// ❓ Searches through all endpoints for Objects that match search phrase.
//===============================================================================
export const searchFunction = async (
  searchPhrase: string,
  searchCategory?: SearchableCategories
): Promise<SearchResult[]> => {
  let resultPromises: Promise<SearchResult[]>[];

  if (searchCategory) {
    resultPromises = Object.keys(endpoints).map(async (key) => {
      const url = `${baseUrl}${endpoints[key as keyof typeof endpoints]}/?${String(searchCategory)}=${searchPhrase}`;
      const result: SearchResult[] = await fetchApi(url);
      return result;
    });
  } else {
    // If no category is provided, search across all categories
    resultPromises = Object.keys(endpoints).map(async (key) => {
      const url = `${baseUrl}${endpoints[key as keyof typeof endpoints]}/?name=${searchPhrase}`;
      const result: SearchResult[] = await fetchApi(url);
      return result;
    });
  }

  const results = await Promise.all(resultPromises);

  return results.flat();
};

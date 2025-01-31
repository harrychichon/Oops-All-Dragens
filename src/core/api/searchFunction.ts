import { baseUrl, endpoints } from "./api.ts";
import { SearchResult, SearchableCategories } from "./types.ts";
import { fetchApi } from "./fetchFunctions.ts";

// Searches through all endpoints for Objects that match search phrase.
//
// HOW TO USE
// const searchResults = await searchFunction("search phrase");
// nameOfContainerToStoreData.push(...searchResults);

// TODO Efter allt är typat: User input för vilken kategori som genomsökes (ink. en för "alla")
// TODO Add throw error
export const searchFunction = async (
  searchPhrase: string,
  searchCategory?: SearchableCategories
): Promise<SearchResult[]> => {
  let resultPromises: Promise<SearchResult[]>[];

  if (searchCategory) {
    // If a specific search category is given
    resultPromises = Object.keys(endpoints).map(async (key) => {
      const url = `${baseUrl}${endpoints[key as keyof typeof endpoints]}/?${String(searchCategory)}=${searchPhrase}`;
      // Make sure fetchApi returns an array of SearchResult objects
      const result: SearchResult[] = await fetchApi(url); // Adjusted to expect an array of SearchResults
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

  // Wait for all fetches to complete and return the combined results
  const results = await Promise.all(resultPromises);

  // Flatten the array of arrays to return a single array of SearchResult
  return results.flat();
};

// TODO Support function to open searched item
// IF SearchedItem {count:} > 0
// API call for SearchedItem: {results: {url: link}]}
// Push fetched object to state
// ELSE nothing/never

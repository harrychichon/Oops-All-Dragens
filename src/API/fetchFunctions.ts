import { baseUrl, endpoints } from "./api";
import { SearchResult } from "../Types/utilityTypes";
import { Monster } from "../Types/monsters";
import { Race } from "../Types/races";

export const fetchApi = async <T>(apiUrl: string): Promise<T> => {
  const response = await fetch(apiUrl);
  const data: T = await response.json();
  return data;
};

//TODO I vilken fil ska jag lägga den här?
//TODO behöver den göras om till discriminate union?
//TODO Skapa type Race
type endpointObjects = Monster | Class | Race;

//TODO Gör så att denna funktionen kan användas för att filtrera Class och Race också

// Helper function to extract desired keys
const filteredData = (object: endpointObjects): endpointObjects => {
  const allowedKeys = new Set<keyof object>(
    Object.keys({}) as (keyof object)[]
  );
  return Object.fromEntries(
    Object.entries(object).filter(([key]) =>
      allowedKeys.has(key as keyof object)
    )
  ) as Monster;
};

//TODO Enum eller Union av typerna för parametern pushArray. ELLER: Ska push tas ut från funktionen så får man lägga till det när man kallar den? Kanske är lättare så
// Fetches all the objects of desired array and opens their url to  get the keys and values
export const fetchAll = async (
  endpointKey: keyof typeof endpoints,
  pushArray: endpointObjects[]
) => {
  const getAllObjects: SearchResult = await fetchApi(
    baseUrl + endpoints[endpointKey]
  );
  for (const element of getAllObjects.results) {
    const data: endpointObjects = await fetchApi(
      `${baseUrl}${endpoints[endpointKey]}${element.index}`
    );
    const newObjectStructure = filteredData(data);
    pushArray.push(newObjectStructure);
  }
};

//TODO fetchOne =>

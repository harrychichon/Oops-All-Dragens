import { baseUrl, endpoints } from "./api";
import { SearchResult } from "../../types/utilityTypes";
import { Monster } from "../../types/monsters";
import { Race } from "../../feature/character/types.ts/races";
import { Class } from "../../types/classes";

//===================================================================================================
// ALL PURPOSE FETCH
//===================================================================================================
export const fetchApi = async <T>(apiUrl: string): Promise<T> => {
  const response = await fetch(apiUrl);
  const data: T = await response.json();
  return data;
};
//===================================================================================================

//===================================================================================================
// Helper function to extract desired keys
//===================================================================================================
const allowedKeys: Record<string, Set<string>> = {
  Monster: new Set([
    "name",
    "armor_class",
    "hit_points",
    "hit_dice",
    "hit_points_roll",
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
    "proficiencies",
    "challenge_rating",
    "xp",
    "special_abilities",
    "actions",
    "image",
  ]),
  Class: new Set([
    "name",
    "hit_die",
    "proficiencies",
    "saving_throws",
    "starting_equipment",
    "starting_equipment_options",
  ]),
  Race: new Set(["name", "ability_bonuses", "alignment", "age", "size_description", "starting_proficiencies"]),
};

const filterObjectKeys = <T extends Record<string, any>>(obj: T): Partial<T> => {
  let typeKey: keyof typeof allowedKeys;

  if ("armor_class" in obj) {
    typeKey = "Monster";
  } else if ("hit_die" in obj) {
    typeKey = "Class";
  } else if ("ability_bonuses" in obj) {
    typeKey = "Race";
  } else {
    throw new Error("Unknown object type");
  }

  return Object.fromEntries(Object.entries(obj).filter(([key]) => allowedKeys[typeKey].has(key))) as Partial<T>;
};
//===================================================================================================

//===================================================================================================
// FETCH ALL AND RESTRUCTURE
//===================================================================================================
export const fetchAndRestructureAllObjects = async <T extends Record<string, any>>(
  endpointKey: keyof typeof endpoints,
  pushArray: Partial<T>[]
): Promise<Partial<T>[]> => {
  const getAllObjects: SearchResult = await fetchApi(baseUrl + endpoints[endpointKey]);

  for (const element of getAllObjects.results) {
    const fetchedObject: T = await fetchApi(`${baseUrl}${endpoints[endpointKey]}${element.index}`);

    // Apply the new filtering logic
    const filteredObject = filterObjectKeys(fetchedObject);

    pushArray.push(filteredObject);
  }

  return pushArray;
};

//===================================================================================================

//===================================================================================================
// FETCH ONE AND RESTRUCTURE
//===================================================================================================
export const fetchAndRestructureOneObject = async <T extends Record<string, any>>(
  endpointKey: keyof typeof endpoints,
  objectName: string
): Promise<Partial<T>> => {
  const fetchedObject: T = await fetchApi(
    `${baseUrl}${endpoints[endpointKey]}${objectName}`.toLowerCase().replaceAll(" ", "-")
  );

  // Filter the object dynamically based on its type
  const restructuredObject = filterObjectKeys(fetchedObject);

  return restructuredObject;
};

//===================================================================================================

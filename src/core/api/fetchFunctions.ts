import { baseUrl, endpoints } from "./api";
import { SearchResult } from "./types";
import { EntityMap, isType } from "../typeGuards";

//===============================================================================
// ❓ UNIVERSAL FETCH FUNCTION
//===============================================================================
export const fetchApi = async <T>(apiUrl: string): Promise<T> => {
  const response = await fetch(apiUrl);
  return response.json();
};


//===============================================================================
// ❓ HELPER FUNCTION: FLATTEN OBJECT STRUCTURE (USED WHEN FILTERED KEYS ARE 
//    NESTED)
//===============================================================================
const flattenObject = (obj: any, prefix = ""): Record<string, any> =>
  Object.assign(
    {},
    ...Object.entries(obj).map(([key, value]) =>
      typeof value === "object" && value !== null
        ? flattenObject(value, `${prefix}${key}.`)
        : { [`${prefix}${key}`]: value }
    )
  );


//===============================================================================
// ❓ ALLOWED KEYS CONFIGURATION
//===============================================================================
const allowedKeys: Record<string, Record<string, Set<string> | null>> = {
  monster: {
    name: null,
    armor_class: null,
    hit_points: null,
    hit_dice: null,
    hit_points_roll: null,
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
    proficiencies: null,
    challenge_rating: null,
    xp: null,
    special_abilities: null,
    actions: null,
    image: null,
  },
  class: {
    name: null,
    hit_die: null,
    proficiency_choices: null,
    proficiencies: null,
    saving_throws: null,
    starting_equipment: new Set(["equipment.name", "quantity"]),
    starting_equipment_options: new Set(["choose", "count", "of.name"]),
  },
  race: {
    name: null,
    ability_bonuses: null,
    alignment: null,
    age: null,
    size_description: null,
    starting_proficiencies: null,
  },
};

//===============================================================================
// ❓ FILTER/APPLY ALLOWED KEYS FUNCTION
//===============================================================================
export const filterAllowedKeys = <T extends Record<string, any>>(
  entityType: string,
  data: T
): Partial<T> => {
  const entityRules = allowedKeys[entityType.toLowerCase()];


  if (!entityRules) {
    console.warn(`No allowed keys defined for entity type: ${entityType}`);
    return {};
  }

  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => key in entityRules) // Keep only allowed top-level keys
      .map(([key, value]) => {
        const subKeys = entityRules[key];

        if (subKeys instanceof Set && Array.isArray(value)) {
          return [
            key,
            value.map((item) =>
              Object.fromEntries(
                Object.entries(flattenObject(item)).filter(([subKey]) =>
                  subKeys.has(subKey)
                )
              )
            ),
          ];
        }

        return [key, value]; // Return as-is if no filtering is needed
      })
  ) as Partial<T>;
};


//===============================================================================
// ❓ FETCH & RESTRUCTURE ALL OBJECTS
//===============================================================================
export const fetchAndRestructureAllObjects = async <T extends Record<string, any>>(
  endpointKey: keyof typeof endpoints,
  pushArray: Partial<T>[]
): Promise<Partial<T>[]> => {
  const getAllObjects: SearchResult = await fetchApi(baseUrl + endpoints[endpointKey]);

  for (const element of getAllObjects.results) {
    const fetchedObject: T = await fetchApi(`${baseUrl}${endpoints[endpointKey]}${element.index}`);

    const filteredObject = filterAllowedKeys(endpointKey, fetchedObject);
    pushArray.push(filteredObject);
  }

  return pushArray;
};


//===============================================================================
// ❓ FETCH & RESTRUCTURE A SINGLE OBJECT
//===============================================================================
export const fetchAndRestructureOneObject = async <T extends keyof EntityMap>(
  endpointKey: keyof typeof endpoints,
  objectName: string
): Promise<EntityMap[T]> => {
  const fetchedObject = await fetchApi(
    `${baseUrl}${endpoints[endpointKey]}${objectName.toLowerCase().replaceAll(" ", "-")}`
  );

  // Dynamically check the entity type and apply filtering
  for (const entityType of Object.keys(allowedKeys) as T[]) {
    if (isType(fetchedObject, entityType)) {
      return filterAllowedKeys(entityType, fetchedObject) as EntityMap[T];
    }
  }

  throw new Error(`Unknown object type for ${objectName}`);
};

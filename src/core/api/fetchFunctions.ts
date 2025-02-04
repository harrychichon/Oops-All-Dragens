import { baseUrl, endpoints } from "./api";
import { SearchResult } from "./types";
import { EntityMap, isType } from "../typeGuards";
import { Equipment } from "../../feature/cards/equipment";

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
const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  let result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.assign(result, flattenObject(item, `${newKey}[${index}].`));
      });
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenObject(value, `${newKey}.`));
    } else {
      result[newKey] = value;
    }
  }


  return result;
};



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
    starting_equipment: new Set(["name", "quantity"]),
    starting_equipment_options: new Set(["choose", "count", "name"]),
  },
  race: {
    name: null,
    ability_bonuses: null,
    alignment: null,
    age: null,
    size_description: null,
    starting_proficiencies: null,
  },
  equipment: {
    name: null,
    equipment_category: null,
    armor_class: null,
    damage: null,
    image: null,
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
            value.map((item) => {
              const flatItem = flattenObject(item);


              const filteredItem = Object.fromEntries(
                Object.entries(flatItem).filter(([origKey]) => {
                  // Extract last part of the key (e.g., "from.options.count" → "count")
                  const lastKeyPart = origKey.split(".").pop() || "";

                  // Check if the last part matches an allowed key
                  const isAllowed = subKeys.has(lastKeyPart);



                  return isAllowed;
                })
              );

              return filteredItem;
            }),
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

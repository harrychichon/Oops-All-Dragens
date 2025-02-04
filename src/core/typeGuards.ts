import { Monster } from "../feature/cards/monsters";
import { Class } from "../feature/character/types.ts/classes";
import { Race } from "../feature/character/types.ts/races";
import { Equipment, EquipmentCard } from "../feature/cards/equipment";
import { Character } from "../feature/character/types.ts/character";

// Define the allowed type names
type EntityType = "monster" | "spell" | "equipment" | "magicItem" | "character" | "class" | "race"; //TODO Varför har jag inte använt variabeln?

// Define a mapping from type names to actual TypeScript types
export type EntityMap = {
  monster: Monster;
  spell: Spell;
  equipmentCard: EquipmentCard;
  magicItem: MagicItem;
  character: Character;
  class: Class;
  race: Race;
};

// Define a helper function to check if an object has a set of required keys
const hasKeys = <T extends keyof EntityMap>(obj: unknown, keys: (keyof EntityMap[T])[]): obj is EntityMap[T] => {
  return typeof obj === "object" && obj !== null && keys.every((key) => key in obj);
};

// Unified type guard function
export const isType = <T extends keyof EntityMap>(obj: unknown, type: T): obj is EntityMap[T] => {
  switch (type) {
    case "monster":
      return hasKeys(obj, ["armor_class", "hit_points", "challenge_rating"]);
    case "spell":
      return hasKeys(obj, ["level", "casting_time", "components"]);
    case "equipmentCard":
      return hasKeys(obj, ["cost", "weight", "equipment_category"]);
    case "magicItem":
      return hasKeys(obj, ["rarity", "desc"]);
    case "character":
      return hasKeys(obj, ["name", "abilities"]);
    case "class":
      return hasKeys(obj, ["name", "hit_die"]);
    case "race":
      return hasKeys(obj, ["name", "starting_proficiencies"]);
    default:
      return false;
  }
};

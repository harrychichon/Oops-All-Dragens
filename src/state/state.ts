import { Monster } from "../types/monsters";
import { Equipment } from "../feature/inventory/equipment";
import { GamePhase } from "../constants/constants";

// Stored in array and map for different uses
type GameData = {
  monsters: Monster[];
  monsterMap: Record<string, Monster>;
  equipment: Equipment[];
  equipmentMap: Record<string, Equipment>;
  //   magicItems: MagicItem[];
  //   magicItemsMap: Record<string, MagicItem>;
  //   spells: Spell[];
  //   spellMap: Record<string, Spell>;
};

const GameData = {
  monsters: [],
  monsterMap: {},
  equipment: [],
  equipmentMap: {},
  // magicItems: [],
  // magicItemsMap: {},
  // spells: [],
  // spellMap: {}
};


//SWITCH
// case activeGamePhase === GamePhase.PlayerExplore = {possible actions(Draw monster/room card, use items, use abilities)}
// case activeGamePhase === GamePhase.PlayerCombat = {possible actions(Target aquisition(action(hit rolls, save rolls)), Use item)}
// case activeGamePhase === GamePhase.MonsterCombat = {possible actions(save rolls, counter abilities?)}
// case activeGamePhase === GamePhase.PlayerLoot = {possible actions(loot x times, End turn)}
// case activeGamePhase === GamePhase.Loading = {possible actions(null)}
// case activeGamePhase === GamePhase.Error = {possible actions(cry)}


//TODO Funktion som reglerar vad som sker under respektive GamePhase


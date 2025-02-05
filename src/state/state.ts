import { Monster } from "../feature/cards/monsters";
import { Equipment } from "../feature/cards/equipment";
import { Character } from "../feature/character/types.ts/character";
import { createCharacterForm } from "../feature/character/CharacterForm/createCharacter";

//===============================================================================
// ❓ STATE
//===============================================================================
// Stored in array and map for different uses
type GameData = {
  character: Character;
  monsters: Monster[];
  monsterMap: Record<string, Monster>;
  equipment: Equipment[];
  equipmentMap: Record<string, Equipment>;
  //   magicItems: MagicItem[];
  //   magicItemsMap: Record<string, MagicItem>;
  //   spells: Spell[];
  //   spellMap: Record<string, Spell>;
};

export let table: GameData = {
  character: {
    name: "",
    race: "",
    class: "",
    hitdie: {
      name: "",
      sides: 0
    },
    proficiencies: [],
    savingThrows: [],
    abilityScores: {},
    equipped: [],
    inventory: [],
    hitPoints: 0,
    armorClass: 0,
    attackBonus: {}
  },
  monsters: [],
  monsterMap: {},
  equipment: [],
  equipmentMap: {},
  // magicItems: [],
  // magicItemsMap: {},
  // spells: [],
  // spellMap: {}
};

console.log(table);



//SWITCH
// case activeGamePhase === GamePhase.PlayerExplore = {possible actions(Draw monster/room card, use items, use abilities)}
// case activeGamePhase === GamePhase.PlayerCombat = {possible actions(Target aquisition(action(hit rolls, save rolls)), Use item)}
// case activeGamePhase === GamePhase.MonsterCombat = {possible actions(save rolls, counter abilities?)}
// case activeGamePhase === GamePhase.PlayerLoot = {possible actions(loot x times, End turn)}
// case activeGamePhase === GamePhase.Loading = {possible actions(null)}
// case activeGamePhase === GamePhase.Error = {possible actions(cry)}



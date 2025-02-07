import { isType } from "../../../core/typeGuards";
import { Dice } from "../../../core/utils/types/dice";
import { EquipmentCard } from "../../cards/equipment";
import { AbilityBonus } from "./abilityScore";
import { Class } from "./classes";
import { Race } from "./races";

export const calculateModifier = (score: number): number => Math.floor((score - 10) / 2);

export const calculateMaxHP = (hitDie: Dice, constitution: number): number => hitDie.sides + calculateModifier(constitution);

export const calculateArmorClass = (dexterity: AbilityBonus["bonus"], equipped: EquipmentCard[]): number => {
    let armorClass = 10 + calculateModifier(dexterity);
    equipped.forEach((item) => {
        if (isType(item, "armor")) {
            armorClass += item.armor_class.base;
        }
    });
    return armorClass;
};

export const calculateAttackBonus = (strengthOrDexterity: number, equipped: EquipmentCard[]): number => {
    let attackBonus = calculateModifier(strengthOrDexterity);
    equipped.forEach((item) => {
        if (isType(item, "weapon")) {
            attackBonus += calculateModifier(strengthOrDexterity);
        }
    });
    return attackBonus;
}


// export type Character = {
//     name: string;
//     race: string;
//     class: string
//     hitdie: number;
//     proficiencies: string[];
//     savingThrows: string[];
//     abilityScores: { [key: string]: number };
//     equipped: EquipmentCard[];
//     inventory: EquipmentCard[];
//     hitPoints: number
//     armorClass: number;
//     attackBonus: { [key: string]: number };

// };

export type Character = {
    name: string;
    race: Race["name"];
    class: Class["name"];
    hitdie: Class["hit_die"];
    proficiencies: Class["proficiencies"];
    savingThrows: Class["saving_throws"];
    abilityScores: AbilityScore[];
    equipped: EquipmentCard[];
    inventory: EquipmentCard[];
    hitPoints: number
    armorClass: number;
    attackBonus: { [key: string]: number };

};


// ADD Spellcasting Ability (if applicable) = Determined by your class (e.g., Intelligence for Wizards, Charisma for Sorcerers).



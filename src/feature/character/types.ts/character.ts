import { Dice } from "../../../core/utils/types/dice";
import { EquipmentCard } from "../../cards/equipment";


export const calculateModifier = (score: number): number => Math.floor((score - 10) / 2);
export const calculateMaxHP = (hitDie: Dice, constitution: number): number => hitDie.sides + calculateModifier(constitution);
export const calculateArmorClass = (dexterity: number, equipped: EquipmentCard[]): number => {
    let armorClass = 10 + calculateModifier(dexterity);
    equipped.forEach((item) => {
        if (item.equipment_category === "Armor") {
            armorClass += item.armor_class.base; //TODO Varför när armor_class finns på type Armor?
        }
    });
    return armorClass;
};
// const calculateAttackBonus = (strengthOrDexterity: number, equipped: EquipmentCard[]): number => {  strengthOrDexterity + 


export type Character = {
    name: string;
    race: string;
    class: string
    hitdie: Dice;
    proficiencies: string[];
    savingThrows: string[];
    abilityScores: { [key: string]: number };
    equipped: EquipmentCard[];
    inventory: EquipmentCard[];
    hitPoints: number
    armorClass: number;
    attackBonus: { [key: string]: number };

};



// ADD Spellcasting Ability (if applicable) = Determined by your class (e.g., Intelligence for Wizards, Charisma for Sorcerers).



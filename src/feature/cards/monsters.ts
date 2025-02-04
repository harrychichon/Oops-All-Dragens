import { DiceRoll } from "../../core/utils/types/dice";
import { Proficiency } from "../character/types.ts/proficiencies";
import { HP } from "../../core/utils/types/hp";

export type Monster = {
  name: string;
  armor_class: number[];
  hit_points: HP;
  hit_dice: DiceRoll;
  hit_points_roll: `${DiceRoll}+${number}`;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: {
    value: number;
    proficiency: {
      name: Proficiency;
    };
  }[];
  challenge_rating: number;
  proficiency_bonus: number; //TODO Behövs den här?
  xp: number;
  special_abilities: [
    {
      name: string;
      desc: string;
      spellcasting?: {
        //TODO När monster hämtas: IF spellcasting, get spell, ELSE get other ability
        level: number;
        ability: {
          name: string; //TODO Uppdatera till Spell.name efter alla spells är typade
        };
        dc?: number;
      };
      modifier: number; //TODO Behövs den här?
      spells: [
        {
          name: string;
          level: number;
          url: string;
          usage?: {
            type: string;
            rest_types: [];
          };
          notes?: string;
        }
      ];
    }
  ];
  actions: [
    {
      name: string;
      desc: string;
      attack_bonus?: number;
      dc?: number;
      damage?: {
        damage_dice: `${DiceRoll}+${number}`;
      }[];
      usage?: {
        type: string; // string
        times: number; // number
      };
    }[],
    legendary_actions?: {
      //TODO IF legendary, get 1 action and 1 legendary actoin
      name: string;
      desc: string;
      attack_bonus?: number;
      damage?: {
        damage_dice: `${DiceRoll}+${number}`;
      }[];
    }
  ];
  image: string; //TODO string eller spara som .png eller skapa en typ som innehåller .png?
};

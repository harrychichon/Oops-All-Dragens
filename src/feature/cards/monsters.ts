import { Dice } from "../../core/utils/types/dice";
import { Proficiency } from "../character/types.ts/proficiencies";
import { HP } from "../../core/utils/types/hp";

export type Monster = {
  name: string;
  armor_class: number[];
  hit_points: HP;
  hit_dice: Dice;
  hit_points_roll: number;
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
  proficiency_bonus: number;
  xp: number;
  special_abilities: [
    {
      name: string;
      desc: string;
      spellcasting?: {

        level: number;
        ability: {
          name: string;
        };
        dc?: number;
      };
      modifier: number;
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

      name: string;
      desc: string;
      attack_bonus?: number;
      damage?: {
        damage_dice: `${DiceRoll}+${number}`;
      }[];
    }
  ];
  image: string; 

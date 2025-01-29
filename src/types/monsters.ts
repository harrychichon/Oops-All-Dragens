import { Condition } from "../constants/constants";
import { DiceRoll } from "./dice";
import { Proficiency } from "./proficiencies";
import { DifficultyClass } from "./utilityTypes";
import { HP } from "./hp";

// Enums instead of string literals so runtime checks can be applied

export type ArmorClass = {
  type: string;
  value: number;
  armor?: string[];
  condition?: Condition[];
  desc: string;
};

enum MonsterType {
  Aberration = "aberration",
  Beast = "beast",
  Celestial = "celestial",
  Construct = "construct",
  Dragon = "dragon",
  Elemental = "elemental",
  Fey = "fey",
  Fiend = "fiend",
  Giant = "giant",
  Humanoid = "humanoid",
  Monstrosity = "monstrosity",
  Ooze = "ooze",
  Plant = "plant",
  SvarmOfTinyBeasts = "swarm of Tiny beasts",
  Undead = "undead",
}

export enum DamageType {
  Acid = "acid",
  Bludgeoning = "bludgeoning",
  BludgeoningFromNonmagicalWeapons = "Bludgeoning from nonmagical weapons",
  BludgeoningFromNonmagicalWeaponsThatArentAdamantine = "Bludgeoning from nonmagical weapons that aren't adamantine",
  BludgeoningFromNonmagicalWeaponsThatArentSilvered = "Bludgeoning from nonmagical weapons that aren't silvered",
  Cold = "cold",
  Fire = "fire",
  Lightning = "lightning",
  Necrotic = "necrotic",
  NonAdamantineWeapons = "bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
  NonMagicalWeapons = "bludgeoning, piercing, and slashing from nonmagical weapons",
  NonSilveredWeapons = "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
  Piercing = "piercing",
  PiercingFromMagicWeaponsWieldedByGoodCreatures = "piercing from magic weapons wielded by good creatures",
  PiercingFromNonmagicalWeapons = "Piercing from nonmagical weapons",
  PiercingFromNonmagicalWeaponsThatArentAdamantine = "Piercing from nonmagical weapons that aren't adamantine",
  PiercingFromNonmagicalWeaponsThatArentSilvered = "Piercing from nonmagical weapons that aren't silvered",
  Poison = "poison",
  Psychic = "psychic",
  Radiant = "radiant",
  Slashing = "slashing",
  SlashingFromNonmagicalWeapons = "Slashing from nonmagical weapons",
  SlashingFromNonmagicalWeaponsThatArentAdamantine = "Slashing from nonmagical weapons that aren't adamantine",
  SlashingFromNonmagicalWeaponsThatArentSilvered = "Slashing from nonmagical weapons that aren't silvered",
  Spells = "damage from spells",
  Stoneskin = "bludgeoning, piercing, and slashing from nonmagical attacks (from stoneskin)",
  Thunder = "thunder",
}

export type Monster = {
  name: string;
  armor_class: ArmorClass[];
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
        dc?: DifficultyClass;
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
      dc?: DifficultyClass;
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

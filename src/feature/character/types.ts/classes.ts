import { AbilityBonus } from "./abilityScore";
import { Proficiency } from "./proficiencies";
import { Equipment } from "../../cards/equipment";
import { Dice } from "../../../core/utils/types/dice";

export type Class = {
  name: string;
  hit_die: Dice;
  proficiencies_choices: [
    {
      desc: string;
      choose: number;
      from: {
        options: [
          item: {
            name: Proficiency;
          }
        ];
      };
    }
  ];
  proficiencies: [{
    name: Proficiency,
  }
  ]
  saving_throws: [
    {
      name: AbilityBonus;
    }
  ];
  starting_equipment: [
    {
      equipment: {
        index: string,
        name: Equipment,
        url: string,
      },
      quantity: number,
    }
  ];
  starting_equipment_options: [
    {
      equipment: any;
      desc: string;
      choose: number;
      from: {
        options: [
          {
            count?: number;
            of?: {
              name: Equipment;
              url: string;
            };
            items?: [
              {
                count?: number;
                of?: {
                  name: Equipment;
                  url: string;
                };
                choice?: {
                  choose: number;
                  from: {
                    equipment_category: {
                      name: Equipment;
                      url: string;
                    };
                  };
                };
              }
            ];
            choice?: {
              choose: number;
              from: {
                equipment_category: {
                  name: Equipment;
                  url: string;
                };
              };
            };
          }
        ];
      };
    }
  ];
};

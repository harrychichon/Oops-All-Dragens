import { AbilityScore } from "./abilityScore";
import { Proficiency } from "./proficiencies";
import { Equipment } from "../../cards/equipment";

export type Class = {
  name: string;
  hit_die: number;
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
      name: AbilityScore;
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

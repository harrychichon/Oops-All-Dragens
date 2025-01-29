import { AbilityScore } from "../constants/constants";
import { Proficiency } from "./proficiencies";
import { Equipment } from "./equipment";

export type Class = {
  name: string;
  hit_die: number;
  proficiencies: [
    {
      name: Proficiency;
    }
  ];
  saving_throws: [
    {
      name: AbilityScore;
    }
  ];
  starting_equipment: Equipment[];
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
  // class_levels: string; //TODO Vill jag lägga in den här=
};

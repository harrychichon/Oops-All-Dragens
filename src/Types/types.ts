
export type Monster = {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: Array<{
    type: string;
    value: number;
  }>;
  hit_points: number;
  hit_dice: string;
  hit_points_roll: string;
  speed: {
    walk: string;
    swim: string;
  };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: Array<{
    value: number;
    proficiency: {
      index: string;
      name: string;
      url: string;
    };
  }>;
  damage_vulnerabilities: Array<string>;
  damage_resistances: Array<string>;
  damage_immunities: Array<string>;
  condition_immunities: Array<string>;
  senses: {
    darkvision: string;
    passive_perception: number;
  };
  languages: string;
  challenge_rating: number;
  proficiency_bonus: number;
  xp: number;
  special_abilities: Array<{
    name: string;
    desc: string;
    dc?: {
      dc_type: {
        index: string;
        name: string;
        url: string;
      };
      dc_value: number;
      success_type: string;
    };
  }>;
  actions: Array<{
    name: string;
    multiattack_type?: string;
    desc: string;
    actions: Array<{
      action_name: string;
      count: number;
      type: string;
    }>;
    attack_bonus?: number;
    dc?: {
      dc_type: {
        index: string;
        name: string;
        url: string;
      };
      dc_value: number;
      success_type: string;
    };
    damage?: Array<{
      damage_type: {
        index: string;
        name: string;
        url: string;
      };
      damage_dice: string;
    }>;
    usage?: {
      type: string;
      times: number;
    };
  }>;
  legendary_actions: Array<{
    name: string;
    desc: string;
    attack_bonus?: number;
    damage?: Array<{
      damage_type: {
        index: string;
        name: string;
        url: string;
      };
      damage_dice: string;
    }>;
  }>;
  image: string;
  url: string;
  updated_at: string;
};

export type AbilityBonus = {

  ability_score: {
    name: "CHA" | "CON" | "DEX" | "INT" | "STR" | "WIS",
    index: string;
    url: string;
  };
  bonus: number;
};


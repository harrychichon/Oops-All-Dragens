export const baseUrl: string = "https://www.dnd5eapi.co/api";

// Object instead of Union type or Array to enable iteration of URLs and better readability
export const endpoints = {
  abilityScores: "/ability-scores/",
  alignments: "/alignments/",
  backgrounds: "/backgrounds/",
  classes: "/classes/",
  conditions: "/conditions/",
  damageTypes: "/damage-types/",
  equipment: "/equipment/",
  equipmentCategories: "/equipment-categories/",
  feats: "/feats/",
  features: "/features/",
  languages: "/languages/",
  magicItems: "/magic-items/",
  magicSchools: "/magic-schools/",
  monsters: "/monsters/",
  proficiencies: "/proficiencies/",
  races: "/races/",
  ruleSections: "/rule-sections/",
  rules: "/rules/",
  skills: "/skills/",
  spells: "/spells/",
  subclasses: "/subclasses/",
  subraces: "/subraces/",
  traits: "/traits/",
  weaponProperties: "/weapon-properties/",
};

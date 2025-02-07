import "./createCharacter.scss";
import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject } from "../../../core/api/fetchFunctions";
import { AbilityBonus } from "../types.ts/abilityScore";
import { Class } from "../types.ts/classes";
import { Race } from "../types.ts/races";
import { createRadioButtonGroups } from "../../../core/utils/createRadioButtons";
import { calculateArmorClass, calculateAttackBonus, calculateMaxHP, Character } from "../types.ts/character";
import { availableDice } from "../../../core/utils/types/dice";
import { table } from "../../../state/state";
import { EquipmentCard } from "../../cards/equipment";
import { isType } from "../../../core/typeGuards";

//===============================================================================
// ❓ MAIN FUNCTION
//===============================================================================
const availableClasses: Class[] = [];


const fetchClasses = await fetchAndRestructureOneObject("classes", "Barbarian") as Class;
const fetchRogue = await fetchAndRestructureOneObject("classes", "Rogue") as Class;
const fetchWizard = await fetchAndRestructureOneObject("classes", "Wizard") as Class;

availableClasses.push(fetchClasses, fetchRogue, fetchWizard);
console.log(fetchClasses);


const allRaces: string[] = [
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Halfling",
  "Human",
  "Tiefling",
];

export const createCharacterForm = async (divParent: HTMLElement) => {
  const div: HTMLDivElement = createElement("div", { id: "form-container" });
  divParent.appendChild(div);

  const h2: HTMLHeadingElement = createElement("h2", { innerHTML: "CHARACTER CREATION" });
  div.appendChild(h2)

  //RACE
  const sectionRace: HTMLElement = createElement("section", {
    className: "sectionRace",
  });

  const h3Race: HTMLHeadingElement = createElement("h3", { innerHTML: "Choose a race" })
  sectionRace.appendChild(h3Race)

  createRadioButtonGroups("races", allRaces, sectionRace);
  const selectedRace = createElement("section", { id: "race-current-selection" });

  //CLASS
  const sectionClass = createElement("section", {
    className: "sectionClass"
  });
  const h3Class: HTMLHeadingElement = createElement("h3", { innerHTML: "Choose a class" });
  sectionClass.appendChild(h3Class);

  const classNames: string[] = availableClasses.map((cls) => cls.name);
  createRadioButtonGroups("classes", classNames, sectionClass);
  const selectedClass = createElement("section", { id: "class-current-selection" });

  const sectionAbilityScore: HTMLElement = createElement("div", {
    id: "ability-score-container",
    innerHTML: "Ability Scores",
  });

  const abilityScoreValues: number[] = [15, 14, 13, 12, 10, 8];

  //Creates sections for each Ability Score
  ["CHA", "CON", "DEX", "INT", "STR", "WIS"].forEach((key) => {
    if (isNaN(Number(key))) {
      const sectionAbility = createElement("section", {
        id: key,
        className: key,
        innerHTML: key,
      });
      sectionAbilityScore.appendChild(sectionAbility);
      createRadioButtonGroups(key, abilityScoreValues, sectionAbility);
    }
  });
  const allAbilityScoreRadioGroups = document.querySelectorAll("section");

  //Ensures each value for abilityScoreValues can only be selected for one of the ability scores
  allAbilityScoreRadioGroups.forEach((selectedGroup) => {
    selectedGroup.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      if (!target) return;
      const selectedValue = target.value;
      console.log(selectedValue)
      console.log(target)
      allAbilityScoreRadioGroups.forEach((otherGroups) => {
        if (otherGroups !== selectedGroup) {
          const radioButtons = otherGroups.querySelectorAll(`input[type="radio"]`);
          radioButtons.forEach((radio) => {
            const radioInput = radio as HTMLInputElement;
            if (radioInput.value === selectedValue) {
              radioInput.disabled = true;
            } else {
              radioInput.disabled = false;
            }
          });
        }
      });
    });
  });


  // Character Name
  const characterName: HTMLInputElement = createElement("input", { type: "text", placeholder: "Character Name", id: "character-name" });
  const createCharacterButton = createElement("button", { innerHTML: "Create Character", type: "button" });
  div.append(sectionRace, sectionClass, sectionAbilityScore);
  div.appendChild(characterName);
  div.appendChild(createCharacterButton);

  //DESCRIPTION
  const containerCurrentSelection: HTMLDivElement = createElement("div", { id: "character-description" });
  divParent.appendChild(containerCurrentSelection)
  containerCurrentSelection.append(selectedRace, selectedClass);


  let fetchedClass = {} as Class;
  let fetchedRace = {} as Race

  console.log("Fetched Race:", fetchedRace);
  console.log("Fetched Race Ability Bonuses:", fetchedRace.ability_bonuses);

  //EventListener function to fetch a class/race
  const handleCharacterChoices = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const endpoint = target.name === "races" ? "races" : "classes";


    const response: Race | Class =
      endpoint === "races"
        ? await fetchAndRestructureOneObject("races", target.value)
        : availableClasses.find((cls) => cls.name === target.value)
    console.log(response);

    if (endpoint === "races") {
      fetchedRace = response as Race;
      console.log("Race Selected:", fetchedRace);

      selectedRace.innerHTML = ""; // Clears container so selections won't stack
      const raceName: HTMLHeadingElement = createElement("h3", {
        innerHTML: `${fetchedRace.name.toUpperCase()}`,
      });
      selectedRace.appendChild(raceName)

      // Description
      const raceAbout: HTMLParagraphElement = createElement("p", {
        innerHTML: `
        ${fetchedRace.size_description}
        ${fetchedRace.age}
        `,
      });
      selectedRace.appendChild(raceAbout)

      //Ability bonus
      const raceAbilityBonusTable: HTMLTableElement = createElement("table");
      const tableCaption: HTMLTableCaptionElement = createElement("caption", { innerHTML: "Ability bonuses" })
      raceAbilityBonusTable.appendChild(tableCaption);
      const tableThead: HTMLTableSectionElement = createElement("thead");
      raceAbilityBonusTable.appendChild(tableThead);
      const tr: HTMLTableRowElement = createElement("tr");
      tableThead.appendChild(tr);
      selectedRace.appendChild(raceAbilityBonusTable);

      const mappedBonuses: Record<string, number> = {};
      fetchedRace.ability_bonuses.forEach(({ ability_score: { name }, bonus }) => {
        mappedBonuses[name] = bonus;

        const th: HTMLTableCellElement = createElement("th", { scope: "col", innerHTML: `${name}` });
        tr.appendChild(th);

        const td: HTMLTableCellElement = createElement("td", { innerHTML: `${bonus}` });
        tr.appendChild(td);

        console.log(mappedBonuses);
      });


    } else if (endpoint === "classes") {
      fetchedClass = response as Class;
      console.log("Class Selected:", fetchedClass);

      selectedClass.innerHTML = ""; // Clears container so selections won't stack
      const className: HTMLHeadingElement = createElement("h3", {
        innerHTML: `${fetchedClass.name.toUpperCase()}`,
      });
      selectedClass.appendChild(className)

      // Hit die
      const classAbout: HTMLParagraphElement = createElement("p", {
        innerHTML: `Hit Die: d${fetchedClass.hit_die}`,
      });
      selectedClass.appendChild(classAbout)

      // Remaining class perks and equipment
      const listKeys: (keyof Class)[] = [
        "proficiencies",
        "saving_throws",
        "starting_equipment",
        "starting_equipment_options",
      ];

      listKeys.forEach((key: keyof Class) => {
        const perksAndEquipment = fetchedClass[key] as keyof Class | undefined;

        // Checks type and that it's an array that's not empty
        if (perksAndEquipment && Array.isArray(perksAndEquipment) && perksAndEquipment.length > 0) {

          const classList: HTMLDivElement = createElement("div");
          const h3: HTMLHeadingElement = createElement("h4", {
            innerHTML: key.replace(/_/g, " ").toUpperCase(),
          });
          selectedClass.appendChild(h3);
          selectedClass.appendChild(classList);


          if (key === "starting_equipment") {
            perksAndEquipment.forEach((item) => {
              const listItem: HTMLLIElement = createElement("li", {
                innerHTML: `${item["equipment.name"]} (Quantity: ${item.quantity})`,
              });
              classList.appendChild(listItem);
            });

          } else if (key === "saving_throws") {
            const savingThrows: string[] = perksAndEquipment.map((item) => item.name);
            const listItem = createElement("li", {
              innerHTML: `${savingThrows.join(", ")}`,
            });
            classList.appendChild(listItem);

          } else if (key === "proficiencies") {
            const proficienciesTable: HTMLTableElement = createElement("table");

            classList.appendChild(proficienciesTable);


            perksAndEquipment.forEach((item) => {
              const tr: HTMLTableRowElement = createElement("tr");
              const td: HTMLTableCellElement = createElement("td", { innerHTML: `${item.name}` });
              tr.appendChild(td);
              proficienciesTable.appendChild(tr);
            });

          } else if (key === "starting_equipment_options") {
            perksAndEquipment.forEach((item) => {
              Object.entries(item).forEach(([key, value]) => {
                if (key === "choose") {
                  const div: HTMLDivElement = createElement("div", { innerHTML: `Choose ${value} from: ` });
                  classList.appendChild(div);
                } else if (key === "from.options[0].count" || key === "from.options[1].choice.choose") {
                  classList.innerHTML += `${value} `;
                } else if (key === "from.options[0].of.name" || key === "from.options[1].choice.from.equipment_category.name") {
                  classList.innerHTML += `${value} `;
                }
              });
            });

          }
        }
      });

    } else {
      throw Error("Selection not found.");
    }
  };

  if (sectionRace) {
    sectionRace.addEventListener("change", handleCharacterChoices);
  }
  if (sectionClass) {
    sectionClass.addEventListener("change", handleCharacterChoices);
  }

  const createCharacter = async (): Promise<Character> => {

    const cha = document.querySelector('input[name="CHA"]:checked') as HTMLInputElement | null;
    let numberCha = cha ? Number(cha.value) : 0;
    let con = document.querySelector('input[name="CON"]:checked') as HTMLInputElement | null;
    let numberCon = con ? Number(con.value) : 0;
    let dex = document.querySelector('input[name="DEX"]:checked') as HTMLInputElement | null;
    let numberDex = dex ? Number(dex.value) : 0;
    let int = document.querySelector('input[name="INT"]:checked') as HTMLInputElement | null;
    let numberInt = int ? Number(int.value) : 0;
    let str = document.querySelector('input[name="STR"]:checked') as HTMLInputElement | null;
    let numberStr = str ? Number(str.value) : 0;
    let wis = document.querySelector('input[name="WIS"]:checked') as HTMLInputElement | null;
    let numberWis = wis ? Number(wis.value) : 0;

    const abilityScores: AbilityBonus[] = [

      {
        ability_score: {
          name: "CHA",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "CHA")?.bonus || 0) + numberCha,
      },
      {
        ability_score: {
          name: "CON",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "CON")?.bonus || 0) + numberCon,

      },
      {
        ability_score: {
          name: "DEX",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "DEX")?.bonus || 0) + numberDex,

      },
      {
        ability_score: {
          name: "INT",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "INT")?.bonus || 0) + numberInt,

      },
      {
        ability_score: {
          name: "STR",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "STR")?.bonus || 0) + numberStr,

      },
      {
        ability_score: {
          name: "WIS",
          index: "",
          url: ""
        },
        bonus: (fetchedRace.ability_bonuses.find(bonus => bonus.ability_score.name === "WIS")?.bonus || 0) + numberWis,

      },
    ];


    /// Creates an array of equipment cards for the character's starting equipment
    const equippedGear: EquipmentCard[] = [];
    console.log("Starting Equipment:", fetchedClass.starting_equipment);

    const startingEquipment = fetchedClass.starting_equipment
      .map(e => e.equipment.index)
      .filter((equipment): equipment is string => typeof equipment === "string");

    for (const item of startingEquipment) {
      console.log("Fetching Equipment:", item);
      const data = await fetchAndRestructureOneObject("equipment", item);
      console.log("Fetched Data:", data);

      if (isType(data, "equipmentCard")) {
        equippedGear.push(data);
      }
    }

    console.log("Equipped Gear:", equippedGear);


    const inventory: EquipmentCard[] = [];
    const startingEquipmentOptions = fetchClasses.starting_equipment_options?.map(e =>
      e?.from?.options?.[0]?.of?.name ?? "Unknown"
    ) || [];
    startingEquipmentOptions.forEach((item) => {
      const data = fetchAndRestructureOneObject("equipment", item);
      if (isType(data, "equipmentCard")) {
        inventory.push(data);
      }
    });

    const character: Character = {
      name: characterName.value,
      race: fetchedRace.name,
      class: fetchedClass.name,
      hitdie: fetchedClass.hit_die,
      proficiencies: fetchedClass.proficiencies,
      savingThrows: fetchedClass.saving_throws,
      abilityScores: abilityScores,
      equipped: equippedGear,
      inventory: inventory,
      hitPoints: calculateMaxHP(
        availableDice[2],
        fetchedRace.ability_bonuses.find(bonus => bonus.ability_score["name"] === "CON")?.bonus || 0
      ),

      armorClass: calculateArmorClass(fetchedRace.ability_bonuses.find(bonus => bonus.ability_score["name"] === "DEX")?.bonus || 0, equippedGear) || 0,
      attackBonus: {
        strength: calculateAttackBonus(
          fetchedRace.ability_bonuses.find(bonus => bonus.ability_score["name"] === "STR")?.bonus || 0,
          equippedGear
        ),
      },

    };
    console.log(character)
    return character;
  };

  createCharacterButton.addEventListener("click", () => {

    createCharacter();
    console.log(table);

  });
}
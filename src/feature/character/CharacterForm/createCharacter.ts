import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject } from "../../../core/api/fetchFunctions";
import { AbilityScore } from "../types.ts/abilityScore";
import {} from "../../../core/events";

//===================================================================================================
// SUPPORT FUNCTION
//===================================================================================================
const createRadioButtonGroups = (groupName: string, array: string[] | number[], parent: HTMLElement) => {
  array.forEach((element) => {
    const input = createElement("input", {
      type: "radio",
      id: `${element}-radio-button`,
      name: groupName,
      value: element.toString(),
    });
    parent.appendChild(input);
    const label = createElement("label", { htmlFor: input.id }, element.toString());
    parent.appendChild(label);
  });
};
//===================================================================================================

//===================================================================================================
// MAIN FUNCTION
//===================================================================================================
export const createCharacterForm = (divParent: HTMLElement) => {
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
  const allClasses: string[] = [
    "Bard",
    "Barbarian",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard",
  ];

  const div: HTMLDivElement = createElement("div", {
    innerHTML: `
    <h1>Character creation</h1>
    `,
  });
  divParent.appendChild(div);

  //RACE
  const sectionRace = createElement("section", {
    className: "sectionRace",
    innerHTML: "<h2>Choose a race</h2>",
  });
  createRadioButtonGroups("races", allRaces, sectionRace);

  //CLASS
  const sectionClass = createElement("section", {
    className: "sectionClass",
    innerHTML: "<h2>Choose a class</h2>",
  });
  createRadioButtonGroups("classes", allClasses, sectionClass);

  //DESCRIPTION
  const sectionDescription = createElement("section", { id: "character-description" });
  div.append(sectionRace, sectionClass, sectionDescription);

  //EventListener function to fetch a class/race

  // document.getElementById("section-race");
  // document.getElementById("section-class");
  const handleCharacterChoices = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const endpoint = target.name === "races" ? "races" : "classes";
    const response = await fetchAndRestructureOneObject(endpoint, target.value);
    console.log(response);

    // TODO plocka ut varje IF och gör till funktion som kallas på för bättre läsbarhet
    if (endpoint === "races") {
      const className = createElement("h3", {
        innerHTML: `${response.name.toUpperCase()}`,
      });
      const raceAbout = createElement("p", {
        innerHTML: `
        ${response.alignment}<br/>
        ${response.size_description}<br/>
        ${response.age}
        `,
      });
      const raceAbilityBonusTable = createElement("table", {
        innerHTML: `
        <caption>Ability bonuses</caption>
        `,
      });

      const tableThead = createElement("thead");
      raceAbilityBonusTable.appendChild(tableThead);

      const tr = createElement("tr");
      tableThead.appendChild(tr);

      // Append the created elements to the DOM
      const parentElement = document.getElementById("character-description");
      if (parentElement) {
        parentElement.appendChild(className);
        parentElement.appendChild(raceAbout);
        parentElement.appendChild(raceAbilityBonusTable);
      }

      const mappedBonuses: Record<string, number> = {};
      response.ability_bonuses.forEach(
        ({ ability_score, bonus }: { ability_score: { name: string }; bonus: number }) => {
          mappedBonuses[ability_score.name] = bonus;
          const th = createElement("th", { scope: "col", innerHTML: `${ability_score.name}` });
          tr.appendChild(th);
          const td = createElement("td", { innerHTML: `${bonus}` });
          th.appendChild(td);
        }
      );

      //TODO starting_proficiencies -> Gå igenom alla proficiencies och ta bort de som är inaktuella
      //TODO starting_proficiencies -> if (!nyckel i enum Proficiency) {ignore} else {hantera}
    } else if (endpoint === "classes") {
      const className = createElement("h3", {
        innerHTML: `${response.name.toUpperCase()}`,
      });
      const raceAbout = createElement("p", {
        innerHTML: `
        ${response.alignment}<br/>
        ${response.size_description}<br/>
        ${response.age}
        `,
      });
      const raceAbilityBonusTable = createElement("table", {
        innerHTML: `
        <caption>Ability bonuses</caption>
        `,
      });

      const tableThead = createElement("thead");
      raceAbilityBonusTable.appendChild(tableThead);

      const tr = createElement("tr");
      tableThead.appendChild(tr);

      // Append the created elements to the DOM
      const parentElement = document.getElementById("character-description");
      if (parentElement) {
        parentElement.appendChild(className);
        parentElement.appendChild(raceAbout);
        parentElement.appendChild(raceAbilityBonusTable);
      }

      const mappedBonuses: Record<string, number> = {};
      response.ability_bonuses.forEach(
        ({ ability_score, bonus }: { ability_score: { name: string }; bonus: number }) => {
          mappedBonuses[ability_score.name] = bonus;
          const th = createElement("th", { scope: "col", innerHTML: `${ability_score.name}` });
          tr.appendChild(th);
          const td = createElement("td", { innerHTML: `${bonus}` });
          th.appendChild(td);
        }
      );
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

  // Player assigns a value from the 'Standard Array' to each ability score
  const abilityScoreValues: number[] = [15, 14, 13, 12, 10, 8];
  const sectionAbilityScore: HTMLElement = createElement("div", {
    id: "ability-score-container",
    innerHTML: "Ability Scores",
  });
  div.appendChild(sectionAbilityScore);
  //TODO Beskrivning av respektive ability score
  //Creates sections for each Ability Score
  Object.keys(AbilityScore).forEach((key) => {
    // This filters out any numeric values from the enum
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

      allAbilityScoreRadioGroups.forEach((otherGroups) => {
        if (otherGroups !== selectedGroup) {
          const radios = otherGroups.querySelectorAll(`input[type="radio"]`);
          radios.forEach((radio) => {
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
};
//===================================================================================================

// ADD starting_equipment based on your class, show them && CHOOSE starting_equipment_options based on your class
// ADD Saving throws
// ADD Proficiencies
// ADD HP = Max of class hit die + Constitution modifier
// ADD Armor Class = Determined by armor, Dexterity modifier, and shields.
// ADD Attack Bonus = Melee: Strength modifier + proficiency bonus. Ranged: Dexterity modifier + proficiency bonus.
// ADD Spellcasting Ability (if applicable) = Determined by your class (e.g., Intelligence for Wizards, Charisma for Sorcerers).
//CHOOSE Name

//showLoader? som i Niklas repo. Se CharacterList.ts
//Dela upp i flera filer?

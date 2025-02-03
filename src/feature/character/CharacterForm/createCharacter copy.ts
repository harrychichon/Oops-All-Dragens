import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject, filterAllowedKeys } from "../../../core/api/fetchFunctions";
import { AbilityScore } from "../types.ts/abilityScore";
import { Class } from "../types.ts/classes";
import { Race } from "../types.ts/races";
import { createRadioButtonGroups } from "../../../core/utils/createRadioButtons";


//===============================================================================
// ❓ MAIN FUNCTION
//===============================================================================
const availableClasses: Class[] = [];

const fetchClasses = await fetchAndRestructureOneObject("classes", "Barbarian") as Class;
const filteredClass = filterAllowedKeys("Class", fetchClasses) as Class;
availableClasses.push(filteredClass);
console.log(filteredClass);

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

export const createCharacterForm = (divParent: HTMLElement) => {
  const div: HTMLDivElement = createElement("div", { // Skapa element för H1
    innerHTML: `
    <h1>Character creation</h1>
    `
  });
  divParent.appendChild(div);

  //RACE
  const sectionRace = createElement("section", { // Skapa element för H2
    className: "sectionRace",
    innerHTML: "<h2>Choose a race</h2>",
  });
  createRadioButtonGroups("races", allRaces, sectionRace);
  const selectedRace = createElement("section", { id: "race-current-selection" });

  //CLASS
  const sectionClass = createElement("section", {
    className: "sectionClass",
    innerHTML: "<h2>Choose a class</h2>",// Skapa element för H2
  });
  const classNames = availableClasses.map((cls) => cls.name);
  createRadioButtonGroups("classes", classNames, sectionClass);
  const selectedClass = createElement("section", { id: "class-current-selection" });

  //DESCRIPTION
  const containerCurrentSelection = createElement("div", { id: "character-description" });
  div.append(sectionRace, sectionClass, containerCurrentSelection);
  containerCurrentSelection.append(selectedRace, selectedClass);

  //EventListener function to fetch a class/race //TODO Flytta till events.ts
  const handleCharacterChoices = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const endpoint = target.name === "races" ? "races" : "classes";

    const response =
      endpoint === "races"
        ? await fetchAndRestructureOneObject("races", target.value)
        : await fetchAndRestructureOneObject("classes", target.value);
    console.log(response);

    if (endpoint === "races") {
      // Heading
      const fetchedRace = response as Race;
      selectedRace.innerHTML = ""; // Clears container so selections won't stack
      const raceName = createElement("h3", {
        innerHTML: `${fetchedRace.name.toUpperCase()}`,
      });
      selectedRace.appendChild(raceName);

      // Description
      const raceAbout = createElement("p", {
        innerHTML: `
      ${fetchedRace.size_description}
      ${fetchedRace.age}
      `
      });
      selectedRace.appendChild(raceAbout);

      // Ability bonus
      const raceAbilityBonusTable = createElement("table");
      const tableCaption = createElement("caption", { innerHTML: "Ability bonuses" });
      raceAbilityBonusTable.appendChild(tableCaption);
      const tableThead = createElement("thead");
      raceAbilityBonusTable.appendChild(tableThead);
      const tr = createElement("tr");
      tableThead.appendChild(tr);
      selectedRace.appendChild(raceAbilityBonusTable);

      const mappedBonuses: Record<string, number> = {};
      fetchedRace.ability_bonuses.forEach(
        ({ ability_score, bonus }: { ability_score: { name: AbilityScore }; bonus: number }) => {
          mappedBonuses[ability_score.name] = bonus;
          const th = createElement("th", { scope: "col", innerHTML: `${ability_score.name}` });
          tr.appendChild(th);
          const td = createElement("td", { innerHTML: `${bonus}` });
          th.appendChild(td);
        }
      );

    } else if (endpoint === "classes") {
      // Heading
      const fetchedClass = response as Class;
      selectedClass.innerHTML = ""; // Clears container so selections won't stack
      const className = createElement("h3", {
        innerHTML: `${fetchedClass.name.toUpperCase()}`,
      });
      selectedClass.appendChild(className);

      // Hit die
      const classAbout = createElement("p", {
        innerHTML: `Hit Die: d${fetchedClass.hit_die}`
      });
      selectedClass.appendChild(classAbout);

      // Remaining class perks and equipment
      const tableKeys: (keyof Class)[] = [
        "proficiencies",
        "saving_throws",
        "starting_equipment",
        "starting_equipment_options",
      ];

      tableKeys.forEach((key) => {
        const items = fetchedClass[key] as any[] | undefined;

        if (items && Array.isArray(items) && items.length > 0) {
          // Create table element
          const classTable = createElement("table");

          // Create and append caption
          const caption = createElement("caption", {
            innerHTML: key.replace(/_/g, " ").toUpperCase(),
          });
          classTable.appendChild(caption);

          // Create table row
          const tr = createElement("tr");
          classTable.appendChild(tr);

          if (key === "starting_equipment") {
            // Only take the first element and create a td with its `name`
            const td = createElement("td", { innerHTML: items[0]?.equipment?.name || "N/A" });
            tr.appendChild(td);
          } else if (key === "starting_equipment_options") {
            // Create a td with `desc`
            const descTd = createElement("td", {
              innerHTML: items[0]?.desc || "N/A",
            });
            tr.appendChild(descTd);

            // Loop through `items[0].from.options` and create tds for each `of.name`
            if (items[0]?.from?.options) {
              items[0].from.options.forEach((option: { count?: number; of?: { name: string; url: string } }) => {
                const optionTd = createElement("td", {
                  innerHTML: option.of?.name || "N/A",
                });
                tr.appendChild(optionTd);
              });
            }
          } else {
            // Default case: each array item gets a td with `name`
            items.forEach((element: { name: string }) => {
              const td = createElement("td", { innerHTML: element.name });
              tr.appendChild(td);
            });
          }

          // Append table to the selection container
          selectedClass.appendChild(classTable);
        }
      });
    }
  };

  // Add event listeners for race and class selection
  sectionRace.addEventListener("change", handleCharacterChoices);
  sectionClass.addEventListener("change", handleCharacterChoices);

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
    // Filter out any numeric values from the enum
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
  allAbilityScoreRadioGroups.forEach((selectedGroup) => { // TODO 1. Varför beter den sig konstigt när man väljer? //TODO 2. Flytta till event.ts
    selectedGroup.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      if (!target) return;
      const selectedValue = target.value;

      allAbilityScoreRadioGroups.forEach((otherGroups) => {
        if (otherGroups !== selectedGroup) {
          const radioButtons = otherGroups.querySelectorAll('input[type="radio"]');
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
}

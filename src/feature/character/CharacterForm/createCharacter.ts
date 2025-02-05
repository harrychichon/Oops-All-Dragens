import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject, fetchApi } from "../../../core/api/fetchFunctions";
import { AbilityScore } from "../types.ts/abilityScore";
import { Class } from "../types.ts/classes";
import { Race } from "../types.ts/races";
import { createRadioButtonGroups } from "../../../core/utils/createRadioButtons";
import { calculateArmorClass, calculateMaxHP, calculateModifier, Character } from "../types.ts/character";
import { availableDice } from "../../../core/utils/types/dice";
import { baseUrl, endpoints } from "../../../core/api/api";
import { table } from "../../../state/state";

//===============================================================================
// ❓ MAIN FUNCTION
//===============================================================================
const availableClasses: Class[] = []; //TODO Flytta till dataStorage

console.log(await fetchApi(`${baseUrl}${endpoints["classes"]}barbarian`))

const fetchClasses = await fetchAndRestructureOneObject("classes", "Barbarian") as Class;
const fetchRogue = await fetchAndRestructureOneObject("classes", "Rogue") as Class;
const fetchWizard = await fetchAndRestructureOneObject("classes", "Wizard") as Class;

availableClasses.push(fetchClasses, fetchRogue, fetchWizard);
console.log(fetchClasses);


// console.log(await availableEquipment)

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

//TODO skapa element för h1
export const createCharacterForm = (divParent: HTMLElement) => {
  const div: HTMLDivElement = createElement("div", {
    innerHTML: `
    <h1>Character creation</h1>
    `,
  });
  divParent.appendChild(div);

  //RACE
  //TODO skapa element för h2
  const sectionRace = createElement("section", {
    className: "sectionRace",
    innerHTML: "<h2>Choose a race</h2>",
  });
  createRadioButtonGroups("races", allRaces, sectionRace);
  const selectedRace = createElement("section", { id: "race-current-selection" });

  //CLASS
  //TODO skapa element för h2
  const sectionClass = createElement("section", {
    className: "sectionClass",
    innerHTML: "<h2>Choose a class</h2>",
  });
  const classNames = availableClasses.map((cls) => cls.name);
  createRadioButtonGroups("classes", classNames, sectionClass);
  const selectedClass = createElement("section", { id: "class-current-selection" });

  //DESCRIPTION
  const containerCurrentSelection = createElement("div", { id: "character-description" });
  div.append(sectionRace, sectionClass, containerCurrentSelection);
  containerCurrentSelection.append(selectedRace, selectedClass);

  //EventListener function to fetch a class/race //TODO Flytta til events.ts
  const handleCharacterChoices = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const endpoint = target.name === "races" ? "races" : "classes";

    const response =
      endpoint === "races"
        ? await fetchAndRestructureOneObject("races", target.value)
        : availableClasses.find((cls) => cls.name === target.value)
    console.log(response);

    if (endpoint === "races") {
      // Heading
      const fetchedRace = response as Race;
      selectedRace.innerHTML = ""; // Clears container so selections won't stack
      const raceName = createElement("h3", {
        innerHTML: `${fetchedRace.name.toUpperCase()}`,
      });
      selectedRace.appendChild(raceName)

      // Description
      const raceAbout = createElement("p", {
        innerHTML: `
        ${fetchedRace.size_description}
        ${fetchedRace.age}
        `,
      });
      selectedRace.appendChild(raceAbout)

      //Ability bonus
      const raceAbilityBonusTable = createElement("table");
      const tableCaption = createElement("caption", { innerHTML: "Ability bonuses" })
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
      selectedClass.appendChild(className)

      // Hit die
      const classAbout = createElement("p", {
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

      listKeys.forEach((key) => {
        const perksAndEquipment = fetchedClass[key] as any[] | undefined; //TODO Ta bort any

        // Checks type and that it's an array that's not empty
        if (perksAndEquipment && Array.isArray(perksAndEquipment) && perksAndEquipment.length > 0) {

          const classList = createElement("div");
          const caption = createElement("h4", {
            innerHTML: key.replace(/_/g, " ").toUpperCase(),
          });
          selectedClass.appendChild(caption);
          selectedClass.appendChild(classList);


          if (key === "starting_equipment") {
            perksAndEquipment.forEach((item) => {
              const listItem = createElement("li", {
                innerHTML: `${item["equipment.name"]} (Quantity: ${item.quantity})`,
              });
              classList.appendChild(listItem);
            });

          } else if (key === "saving_throws") {
            const savingThrows = perksAndEquipment.map((item) => item.name);
            const listItem = createElement("li", {
              innerHTML: `${savingThrows.join(", ")}`,
            });
            classList.appendChild(listItem);

          } else if (key === "proficiencies") {
            const proficienciesTable = createElement("table");

            classList.appendChild(proficienciesTable);


            perksAndEquipment.forEach((item) => {
              const tr = createElement("tr");
              const td = createElement("td", { innerHTML: `${item.name}` });
              tr.appendChild(td);
              proficienciesTable.appendChild(tr);
            });

          } else if (key === "starting_equipment_options") { //TODO Gör clickable
            perksAndEquipment.forEach((item) => {
              Object.entries(item).forEach(([key, value]) => {
                if (key === "choose") {
                  const div = createElement("div", { innerHTML: `Choose ${value} from: ` });
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

  // Player assigns a value from the 'Standard Array' to each ability score
  const abilityScoreValues: number[] = [15, 14, 13, 12, 10, 8];
  const sectionAbilityScore: HTMLElement = createElement("div", {
    id: "ability-score-container",
    innerHTML: "Ability Scores",
  });
  div.appendChild(sectionAbilityScore);

  //Creates sections for each Ability Score
  Object.keys(AbilityScore).forEach((key) => {
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
  //TODO Fixa så att det inte går att välja samma värde för två olika ability scores
  allAbilityScoreRadioGroups.forEach((selectedGroup) => {
    selectedGroup.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      if (!target) return;
      const selectedValue = target.value;

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
  const characterName = createElement("input", { type: "text", placeholder: "Character Name" });
  div.appendChild(characterName);
  const createCharacterButton = createElement("button", { innerHTML: "Create Character", type: "button" });
  div.appendChild(createCharacterButton);

  createCharacterButton.addEventListener("click", () => {
    const createCharacter = () => { //TODO Fixa hela skiten
      const character: Character = {
        name: characterName.value,
        race: selectedRace.innerHTML,
        class: selectedClass.innerHTML,
        hitdie: availableDice[2], //TODO Fixa dynamiskt
        proficiencies: fetchClasses.proficiencies,
        savingThrows: fetchClasses.saving_throws,
        abilityScores: fetchClasses.ability_scores,
        equipped: fetchClasses.starting_equipment,
        inventory: fetchClasses.starting_equipment_options,
        hitPoints: calculateMaxHP(availableDice[2], fetchClasses.ability_scores.constitution),
        armorClass: calculateArmorClass(fetchClasses.ability_scores.dexterity, fetchClasses.starting_equipment),
        attackBonus: {
          strength: AbilityScore.STR + calculateModifier(fetchClasses.ability_scores.STR),
        },
      };
      console.log(character)
      return character;
    };
    table.character = createCharacter();
    console.log(table)
  });
};

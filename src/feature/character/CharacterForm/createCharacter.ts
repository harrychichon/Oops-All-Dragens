import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject, filterAllowedKeys } from "../../../core/api/fetchFunctions";
import { AbilityScore } from "../types.ts/abilityScore";
import { Class } from "../types.ts/classes";
import { Race } from "../types.ts/races";
import { createRadioButtonGroups } from "../../../core/utils/createRadioButtons";
import { availableEquipment } from "../../../core/api/dataStorage";

//===============================================================================
// ❓ MAIN FUNCTION
//===============================================================================
const availableClasses: Class[] = []; //TODO Flytta till dataStorage

const fetchClasses = await fetchAndRestructureOneObject("classes", "Barbarian") as Class;
availableClasses.push(fetchClasses);

console.log(await availableEquipment)

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
  const selectedRace = createElement("section", { id: "race-current-selection" });

  //CLASS
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

  //EventListener function to fetch a class/race
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
          // Create list element
          const classList = createElement("ul");
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

          } else if (key === "starting_equipment_options") {
            perksAndEquipment.forEach((item) => {

              const keys = Object.keys(item);

              for (let index = 0; index < keys.length; index++) {
                let key = keys[index];   // Get the key
                const value = item[key];    // Get the value
                // console.log(value)
                if (key === "choose") {
                  const choose = createElement("li", { innerHTML: `Choose ${value} from: ` })
                  classList.appendChild(choose)
                  console.log(choose);

                } else if (/^from\.options\[\d+\]\.count$/.test(key)) {
                  const count = createElement("ul", { innerHTML: `Count: ${value}` })
                  classList.appendChild(count)
                  console.log(count);

                } else if (/^from\.options\[\d+\]\.of.name$/.test(key)) {
                  const name = createElement("ul", { innerHTML: `${value}` })
                  classList.appendChild(name)
                  console.log(name);


                }
                console.log(index)
              }

            })


          } else {
            perksAndEquipment.forEach((element) => {
              const listItem = createElement("li", { innerHTML: element.name });
              classList.appendChild(listItem);
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
};

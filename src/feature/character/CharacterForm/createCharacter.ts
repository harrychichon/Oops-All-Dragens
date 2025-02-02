import { createElement } from "../../../core/utils/createElement";
import { fetchAndRestructureOneObject, filterAllowedKeys } from "../../../core/api/fetchFunctions";
import { AbilityScore } from "../types.ts/abilityScore";
import { Class } from "../types.ts/classes";
import { Race } from "../types.ts/races";

//===============================================================================
// ❓ SUPPORT FUNCTION
//===============================================================================
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
      const tableCaption = createElement("caption", { innerHTML: "Ability bonuses"})
      raceAbilityBonusTable.appendChild(tableCaption);
      const tableThead = createElement("thead");
      raceAbilityBonusTable.appendChild(tableThead);
      const tr = createElement("tr");
      tableThead.appendChild(tr);
      selectedRace.appendChild(raceAbilityBonusTable);
      
      const mappedBonuses: Record<string, number> = {};
      fetchedRace.ability_bonuses.forEach(
        ({ abilityScore, bonus }: { ability_score: { name: string }; bonus: number }) => { //TODO The fuck is this? Är detta kopplat till att val av score har börjat flippa ur? Troligtvis tänker jag
          mappedBonuses[ability_score.name] = bonus;
          const th = createElement("th", { scope: "col", innerHTML: `${abilityScore.name}` });
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
    const tableKeys: (keyof Class)[] = [
      "proficiencies",
      "saving_throws",
      "starting_equipment",
      "starting_equipment_options",
    ];

    tableKeys.forEach((key) => {
      const perksAndEquipment = fetchedClass[key] as any[] | undefined; //TODO Ändra 'any'

      // Checks type and that it's an array that's not empty
      if (perksAndEquipment && Array.isArray(perksAndEquipment) && perksAndEquipment.length > 0) {
        // Create table element
        const classTable = createElement("table");
        const caption = createElement("caption", {
          innerHTML: key.replace(/_/g, " ").toUpperCase(),
        });
        classTable.appendChild(caption);
        const tr = createElement("tr");
        classTable.appendChild(tr);

        if (key === "starting_equipment") {
          const headerRow = createElement("tr");
          headerRow.appendChild(createElement("th", { innerHTML: "Name" }));
          headerRow.appendChild(createElement("th", { innerHTML: "Quantity" }));
          classTable.appendChild(headerRow);

          // Populate table with starting equipment
          perksAndEquipment.forEach((item) => {
            const row = createElement("tr");
            row.appendChild(
              createElement("td", { innerHTML: item.equipment.name || "N/A" })
            );
            row.appendChild(
              createElement("td", { innerHTML: item.quantity?.toString() || "N/A" })
            );
            classTable.appendChild(row);
          });

        } else if (key === "starting_equipment_options") {
          const headerRow = createElement("tr");
          headerRow.appendChild(createElement("th", { innerHTML: "Choose" }));
          headerRow.appendChild(createElement("th", { innerHTML: "Count" }));
          headerRow.appendChild(createElement("th", { innerHTML: "Name" }));
          classTable.appendChild(headerRow);

          // Populate table with starting equipment options
          perksAndEquipment.forEach((item) => {
            const row = createElement("tr");

            // Create a cell for "choose"
            row.appendChild(
              createElement("td", { innerHTML: item.choose?.toString() || "N/A" })
            );

            // Check if options exist //TODO Behövs den här med nya filtreringen?
            if (item.from?.options) {
              item.from.options.forEach((option: { count?: number; of?: { name: string } }) => {
                const optionRow = createElement("tr");

                // Create a cell for "count"
                optionRow.appendChild(
                  createElement("td", {
                    innerHTML: option.count?.toString() || "N/A",
                  })
                );

                // Create a cell for "name"
                optionRow.appendChild(
                  createElement("td", {
                    innerHTML: option.of?.name || "N/A",
                  })
                );

                classTable.appendChild(optionRow);
              });
            }
            classTable.appendChild(row);
          });
        } else {
          // Default behavior: Create a cell for each object's `name`
          perksAndEquipment.forEach((element) => {
            const td = createElement("td", { innerHTML: element.name });
            tr.appendChild(td);
          });
          classTable.appendChild(tr);
        }

        // Append table to the selection container
        selectedClass.appendChild(classTable);
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

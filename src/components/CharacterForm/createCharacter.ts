import { createElement } from "../../utility/createElement";
import { fetchAll } from "../../api/fetchFunctions";
import { Class } from "../../types/classes";
import { Race } from "../../types/races";
import { AbilityScore } from "../../constants/constants";

//Support function to create groups of radio buttons in the character creation form
const createRadioButtonGroups = (
  array: Race[] | Class[] | number[],
  parent: HTMLElement
) => {
  array.forEach((element) => {
    const isNumber = typeof element === "number";
    const input = createElement("input", {
      type: "radio",
      id: isNumber
        ? `${element}-radio-button`
        : `${(element as Race | Class).name}-radio-button`,
      name: "class",
      value: isNumber ? element.toString() : (element as Race | Class).name,
    });
    parent.appendChild(input);
    const label = createElement(
      "label",
      { htmlFor: input.value },
      isNumber ? element.toString() : (element as Race | Class).name
    );
    parent.appendChild(label);
  });
};

export const createCharacterForm = (divParent: HTMLElement) => {
  const allRaces: Race[] = [];
  const allClasses: Class[] = [];

  fetchAll("races", allRaces);
  fetchAll("classes", allClasses);

  const div: HTMLDivElement = createElement("div", {
    innerHTML: `<h1>Character creation</h1>`,
  });
  divParent.appendChild(div);

  const sectionRace: HTMLElement = createElement("section", {
    innerHTML: `<h2>Choose your race</h2>`,
  });
  const sectionClass: HTMLElement = createElement("section", {
    innerHTML: `<h2>Choose your class</h2>`,
  });
  div.append(sectionRace, sectionClass);

  //Creates Race options
  createRadioButtonGroups(allRaces, sectionRace);

  //Creates Class options
  createRadioButtonGroups(allClasses, sectionClass);

  // Player assigns a value from the 'Standard Array' to each ability score
  const abilityScoreValues: number[] = [15, 14, 13, 12, 10, 8];
  const sectionAbilityScore: HTMLElement = createElement("section", {
    innerHTML: `<h2>Assign the values to your ability scores.</h2>`,
  });
  div.appendChild(sectionAbilityScore);

  for (const value in AbilityScore) {
    const sectionAbility = createElement("section", {
      id: value,
      className: "ability-score",
      innerHTML: `${value}: `,
    });
    sectionAbilityScore.appendChild(sectionAbility);

    createRadioButtonGroups(abilityScoreValues, sectionAbility);
  }

  const allAbilityScoreRadioGroups =
    document.querySelectorAll(".ability-score");

  //Ensures each value for abilityScoreValues can only be selected for one of the ability scores
  allAbilityScoreRadioGroups.forEach((selectedGroup) => {
    selectedGroup.addEventListener("change", (e) => {
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

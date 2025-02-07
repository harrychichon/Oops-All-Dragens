import { createElement } from "./createElement";

//===============================================================================
// ❓ SUPPORT FUNCTION
//===============================================================================
export const createRadioButtonGroups = (groupName: string, array: string[] | number[], parent: HTMLElement) => {
  array.forEach((element) => {
    const input = createElement("input", {
      type: "radio",
      id: `${groupName.toLocaleLowerCase()}-radio-button-${element}`,
      name: groupName,
      value: element.toString(),
    });
    parent.appendChild(input);
    const label = createElement("label", { className: "radio-item", htmlFor: input.id }, element.toString());
    parent.appendChild(label);
  });
};
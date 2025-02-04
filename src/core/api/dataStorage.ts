import { EquipmentCard } from "../../feature/cards/equipment";
import { fetchAndRestructureAllObjects, fetchAndRestructureOneObject } from "./fetchFunctions";
import { Class } from "../../feature/character/types.ts/classes";

export const availableEquipment: EquipmentCard[] = [];
export const availableClasses: Class[] = [];

const loadClassesAndEquipment = async () => {
    const fetchClasses = await fetchAndRestructureOneObject("classes", "Barbarian") as Class;
    availableClasses.push(fetchClasses);

    await fetchEquipment();
};

// Call the function to load classes and equipment
loadClassesAndEquipment();

const fetchEquipment = async (): Promise<EquipmentCard[]> => {
    const stash: EquipmentCard[] = [];
    await fetchAndRestructureAllObjects("equipment", stash);

    console.log("Fetched Equipment Stash:", stash); // Debugging Log

    stash.forEach((item: EquipmentCard) => {
        if (typeof item.equipment_category === 'object' && 'name' in item.equipment_category && (item.equipment_category.name === "Armor" || item.equipment_category.name === "Weapon")) {
            availableEquipment.push(item);
        }
    });


    console.log("Filtered Equipment:", availableEquipment); // Debugging Log

    return stash;
};
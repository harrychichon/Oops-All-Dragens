import "./style.scss";
import { createCharacterForm } from "./feature/character/CharacterForm/createCharacter";

const main = document.querySelector("main") as HTMLDivElement;


await createCharacterForm(main);
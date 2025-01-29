import "./main.scss";
import { createCharacterForm } from "./components/CharacterForm/createCharacter";

document.addEventListener("DOMContentLoaded", () => {
  createCharacterForm(main);
});

const main = document.querySelector("main") as HTMLDivElement;


//TODO drawMonsterCard event
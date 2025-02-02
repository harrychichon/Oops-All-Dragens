import "./main.scss";
import { createCharacterForm } from "./feature/character/CharacterForm/createCharacter";

const main = document.querySelector("main") as HTMLDivElement;
main.innerHTML = `
<h1>Oops, All Dragons: DNDnD (Definitely not Dungeons & Dragons)</h1>
`;


createCharacterForm(main);
import "./main.scss";
import { createCharacterForm } from "./feature/character/CharacterForm/createCharacter";
import { domLoad } from "./core/events";

const main = document.querySelector("main") as HTMLDivElement;
main.innerHTML = `
<h1>Oops, All Dragons || if (gameIsGood === true){ title = DNDnD (Definitely not Dungeons & Dragons); }</h1>
`;

domLoad;
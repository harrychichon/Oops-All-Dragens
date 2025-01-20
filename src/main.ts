import "./main.scss";
import { endpoints } from "./API/api";
import { searchFunction } from "./Components/Search";

console.log(await searchFunction("monsters", "name", "Aboleth"));

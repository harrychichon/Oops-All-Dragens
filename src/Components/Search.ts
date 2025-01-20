import { baseUrl, endpoints } from "../API/api";
import { Monster } from "../Types/types";
import { userInput } from "../State/state.ts";



export const searchFunction = async (
  endpoint: keyof typeof endpoints,
  key: string,
  userInput: string
): Promise<Monster> => {
  const apiSearchKey: string = `${endpoints[endpoint]}/?${key}=${userInput}`;

  const response = await fetch(baseUrl + apiSearchKey);
  const data = await response.json();
    const getObject = data.

  return data;
};

export enum Dice {
  d4 = "d4",
  d6 = "d6",
  d8 = "d8",
  d10 = "d10",
  d12 = "d12",
  d20 = "d20",
}

export type DiceRoll = `${number}${Dice}`;

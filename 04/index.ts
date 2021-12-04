import { AOCSolver } from "../aoc.ts";
import { getExample, getInput } from "../aoc.ts";

type Line = [number, number, number, number, number];
type Card = [Line, Line, Line, Line, Line];
type Game = { nums: number[]; cards: Card[] };

const parse = (input: string): Game => {
  const [firstLine, ...rest] = input.split("\n\n");
  const nums = firstLine.split(",").map(Number);
  const cards = rest.map((x) =>
    x.split("\n").map((x) => x.trim().split(/\s+/).map(Number)) as Card
  );
  return { nums, cards };
};

const getLinesAndCols = (card: Card): Line[] => [
  ...card,
  ...[0, 1, 2, 3, 4].map((n) => card.map((line) => line[n])) as Line[],
];

const lineIsBingo = (line: Line, numsCalled: number[]) =>
  line.filter((v) => numsCalled.includes(v)).length === line.length;

const cardIsBingo = (card: Card, numsCalled: number[]) =>
  !!getLinesAndCols(card).find((line) => lineIsBingo(line, numsCalled));

const playGame = (
  game: Game,
  callCount = 0,
): { winner: Card; numsCalled: number[] } => {
  const numsCalled = game.nums.slice(0, callCount + 1);
  const winner = game.cards.find((card) => cardIsBingo(card, numsCalled));
  return winner ? { winner, numsCalled } : playGame(game, callCount + 1);
};

const getCardScore = (card: Card, numsCalled: number[]) => {
  const unmarked = card.flat().filter((v) => !numsCalled.includes(v));
  return unmarked.reduce((a, b) => a + b, 0) *
    numsCalled[numsCalled.length - 1];
};

const solve: AOCSolver = (input) => {
  const game = parse(input);
  const result = playGame(game);
  const part1 = getCardScore(result.winner, result.numsCalled);
  const part2 = 0;
  return { part1, part2 };
};

console.log(solve(await getExample(4)));
console.log(solve(await getInput(4)));

export default solve;

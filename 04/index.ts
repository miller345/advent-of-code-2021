import { AOCSolver } from "../aoc.ts";

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
): { winner: Card; winnerIndex: number; numsCalled: number[] } => {
  const numsCalled = game.nums.slice(0, callCount + 1);
  const winnerIndex = game.cards.findIndex((card) =>
    cardIsBingo(card, numsCalled)
  );
  return winnerIndex > -1
    ? { winner: game.cards[winnerIndex], winnerIndex, numsCalled }
    : playGame(game, callCount + 1);
};

const playGameToLose = (game: Game): { loser: Card; numsCalled: number[] } => {
  const { winnerIndex, numsCalled } = playGame(game);
  const losingCards = game.cards.filter((_, i) => i !== winnerIndex);
  return losingCards.length === 1
    ? { loser: losingCards[0], numsCalled }
    : playGameToLose({ nums: game.nums, cards: losingCards });
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
  const { loser, numsCalled } = playGameToLose(game);
  const part2 = getCardScore(loser, [
    ...numsCalled,
    game.nums[numsCalled.length],
  ]);
  return { part1, part2 };
};

export default solve;

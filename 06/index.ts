import { AOCSolver } from "../aoc.ts";
// import { getExample, getInput } from "../aoc.ts";

type Fish = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const parse = (input: string) => input.split(",").map(Number) as Fish[];

const tick = (fishes: Fish[]) => {
  const agedFishes = fishes.map((v) => v === 0 ? 6 : v - 1) as Fish[];
  const newFishes = fishes.filter((v) => v === 0).map((_) => 8) as Fish[];
  return [...agedFishes, ...newFishes];
};

const tickFor = (fishes: Fish[], maxTicks: number, tickCount = 0): Fish[] => {
  // console.log(tickCount, fishes.join(","));
  if (tickCount === maxTicks) return fishes;
  const newFishes = tick(fishes);
  return tickFor(newFishes, maxTicks, tickCount + 1);
};

const solve: AOCSolver = (input) => {
  const fishes = parse(input);
  const part1 = tickFor(fishes, 80).length;
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(6)));
// console.log(solve(await getInput(6)));

export default solve;

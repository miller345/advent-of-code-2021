import { AOCSolver } from "../aoc.ts";

type Fish = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type FishCounts = Record<Fish, number>;

const parse = (input: string) => input.split(",").map(Number) as Fish[];

const getFishCounts = (fishes: Fish[]) => {
  return fishes.reduce<FishCounts>(
    (counts, fish) => {
      return { ...counts, [fish]: counts[fish] + 1 };
    },
    [0, 1, 2, 3, 4, 5, 6, 7, 8].reduce(
      (obj, i) => ({ ...obj, [i]: 0 }),
      {},
    ) as FishCounts,
  );
};

const tick = (fishes: FishCounts) => {
  const newFishes: FishCounts = {
    0: fishes[1],
    1: fishes[2],
    2: fishes[3],
    3: fishes[4],
    4: fishes[5],
    5: fishes[6],
    6: fishes[7] + fishes[0],
    7: fishes[8],
    8: fishes[0],
  };
  return newFishes;
};

const tickFor = (
  fishes: FishCounts,
  maxTicks: number,
  tickCount = 0,
): FishCounts => {
  if (tickCount === maxTicks) return fishes;
  const newFishes = tick(fishes);
  return tickFor(newFishes, maxTicks, tickCount + 1);
};

const getTotal = (fishes: FishCounts) =>
  Object.values(fishes).reduce((a, b) => a + b, 0);

const solve: AOCSolver = (input) => {
  const fishes = parse(input);
  const fishCounts = getFishCounts(fishes);
  const part1 = getTotal(tickFor(fishCounts, 80));
  const part2 = getTotal(tickFor(fishCounts, 256));
  return { part1, part2 };
};

export default solve;

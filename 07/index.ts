import { AOCSolver } from "../aoc.ts";
import { getRange } from "../utils.ts";
import { getExample, getInput } from "../aoc.ts";

const parse = (input: string) => input.split(",").map(Number);

const getFuelCost = (value: number, target: number) =>
  Math.max(value, target) - Math.min(value, target);

const getCheapestPosition = (crabs: number[]) => {
  const [max, min] = [Math.max(...crabs), Math.min(...crabs)];
  const costs = getRange(min, max).map((target) =>
    crabs.map((crab) => getFuelCost(crab, target)).reduce((a, b) => a + b, 0)
  );
  const cost = Math.min(...costs);
  const position = costs.indexOf(cost) + min;
  return { cost, position };
};

const solve: AOCSolver = (input) => {
  const crabs = parse(input);
  const part1 = getCheapestPosition(crabs).cost;
  const part2 = 0;
  return { part1, part2 };
};

console.log(solve(await getExample(7)));
console.log(solve(await getInput(7)));

export default solve;

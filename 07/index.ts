import { AOCSolver } from "../aoc.ts";
import { getRange } from "../utils.ts";

const parse = (input: string) => input.split(",").map(Number);

const getFuelCost = (value: number, target: number, crabRules: boolean) => {
  const steps = Math.max(value, target) - Math.min(value, target);
  return crabRules ? ((steps + 1) * steps) / 2 : steps;
};

const getCheapestPosition = (crabs: number[], crabRules: boolean) => {
  const [max, min] = [Math.max(...crabs), Math.min(...crabs)];
  const costs = getRange(min, max).map((target) =>
    crabs.map((crab) => getFuelCost(crab, target, crabRules)).reduce(
      (a, b) => a + b,
      0,
    )
  );
  const cost = Math.min(...costs);
  const position = costs.indexOf(cost) + min;
  return { cost, position };
};

const solve: AOCSolver = (input) => {
  const crabs = parse(input);
  const part1 = getCheapestPosition(crabs, false).cost;
  const part2 = getCheapestPosition(crabs, true).cost;
  return { part1, part2 };
};

export default solve;

import { AOCSolver } from "../aoc.ts";
// import { getExample, getInput } from "../aoc.ts";

const parse = (input: string) =>
  input.split("\n").map((l) => l.split("").map(Number));

const getRiskLevelSum = (grid: number[][]) =>
  grid.map((line, y) =>
    line.map((v, x) => {
      const coords = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]].filter((
        [x, y],
      ) => x >= 0 && x < line.length && y >= 0 && y < grid.length); // remove off grid points
      const values = coords.map(([x, y]) => grid[y][x]);
      return values.find((val) => val <= v) === undefined ? v + 1 : 0;
    })
  ).flat().reduce((a, b) => a + b, 0);

const solve: AOCSolver = (input) => {
  const grid = parse(input);
  const part1 = getRiskLevelSum(grid);
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(9)));
// console.log(solve(await getInput(9)));

export default solve;

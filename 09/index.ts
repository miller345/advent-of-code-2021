import { AOCSolver } from "../aoc.ts";

type Grid = number[][];
type Point = { x: number; y: number };

const parse = (input: string): Grid =>
  input.split("\n").map((l) => l.split("").map(Number));

const getNeighbors = (grid: Grid, { x, y }: Point): Point[] =>
  [
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x: x + 1, y },
  ].filter(
    ({ x, y }) => x >= 0 && x < grid[0].length && y >= 0 && y < grid.length, // remove off grid points
  );

const getLowPoints = (grid: Grid): Point[] =>
  grid.reduce<Point[]>((points, line, y) => {
    const linePoints = line.reduce<Point[]>((arr, v, x) => {
      const neighbors = getNeighbors(grid, { x, y });
      const values = neighbors.map(({ x, y }) => grid[y][x]);
      return values.find((val) => val <= v) === undefined
        ? [...arr, { x, y }]
        : arr;
    }, []);
    return [...points, ...linePoints];
  }, []);

const getRiskLevelSum = (grid: Grid) =>
  getLowPoints(grid).reduce((total, { x, y }) => total + grid[y][x] + 1, 0);

const expandBasinPoints = (
  grid: Grid,
  points: Point[],
  steps = 0,
): Point[] => {
  const { x, y } = points[steps];
  const neighbors: Point[] = [
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x: x + 1, y },
  ].filter(
    ({ x, y }) =>
      x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && // remove off grid points
      grid[y][x] !== 9 && // ignore basin boundary
      points.find((p) => p.x === x && p.y === y) === undefined, // remove points already checked
  );
  if (neighbors.length === 0 && points.length - 1 === steps) return points;
  return expandBasinPoints(grid, [...points, ...neighbors], steps + 1);
};

const getPart2 = (grid: Grid) => {
  const basins = getLowPoints(grid).map((point) =>
    expandBasinPoints(grid, [point])
  );
  const basinSizes = basins.map((b) => b.length).sort((a, b) => b - a);
  return basinSizes[0] * basinSizes[1] * basinSizes[2];
};

const solve: AOCSolver = (input) => {
  const grid = parse(input);
  const part1 = getRiskLevelSum(grid);
  const part2 = getPart2(grid);
  return { part1, part2 };
};

export default solve;

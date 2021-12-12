import { AOCSolver } from "../aoc.ts";

type Line = number[];
type Grid = Line[];
type Point = { x: number; y: number };

const parse = (input: string) =>
  input.split("\n").map((line) => line.split("").map(Number));

const asString = (p: Point) => `${p.x},${p.y}`;

const setValues = (
  grid: Grid,
  setter: (currentValue: number, point: Point) => number,
): Grid => grid.map((line, y) => line.map((v, x) => setter(v, { x, y })));

const getPointsWithValue = (grid: Grid, value: number) =>
  grid.reduce<Point[]>((points, line, y) => {
    return [
      ...points,
      ...line.reduce<Point[]>(
        (points, v, x) => v === value ? [...points, { x, y }] : points,
        [],
      ),
    ];
  }, []);

const getNeighbors = ({ x, y }: Point): Point[] =>
  [
    { x: x - 1, y: y - 1 },
    { x: x + 0, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y + 0 },
    { x: x + 1, y: y + 0 },
    { x: x - 1, y: y + 1 },
    { x: x + 0, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].filter(({ x, y }) => x >= 0 && y >= 0 && x <= 9 && y <= 9);

const flash = (grid: Grid): Grid => {
  // 10 = will flash on this itteration, 11 = already flashed
  const willFlash = getPointsWithValue(grid, 10);
  if (willFlash.length === 0) {
    const newGrid = setValues(grid, (v) => v === 11 ? 0 : v); // set 11s to 0
    return newGrid;
  }
  const neighbors = willFlash.map(getNeighbors).flat(); // may include duplicates
  const newGrid = setValues(grid, (value, point) => {
    // keep track of whats flashed
    if (value === 11) return 11;
    // set those that just flashed to 11
    if (value === 10) return 11;
    // increase value based on neighbors that flashed
    const newValue = value +
      neighbors.map(asString).filter((x) => x === asString(point)).length;
    // dont exceed 10 so triggers a flash
    if (newValue >= 10) return 10;
    return newValue;
  });
  return flash(newGrid);
};

const runFor = (
  grid: Grid,
  maxRuns: number,
  flashCount = 0,
  runCount = 0,
): number => {
  const newFlashCount = flashCount + getPointsWithValue(grid, 0).length;
  if (runCount === maxRuns) return newFlashCount;
  const newGrid = flash(setValues(grid, (v) => v + 1));
  return runFor(
    newGrid,
    maxRuns,
    newFlashCount,
    runCount + 1,
  );
};

const runUntilSync = (
  grid: Grid,
  runCount = 0,
): number => {
  const flashCount = getPointsWithValue(grid, 0).length;
  const totalLength = grid.length * grid[0].length;
  if (flashCount === totalLength) return runCount;
  const newGrid = flash(setValues(grid, (v) => v + 1));
  return runUntilSync(
    newGrid,
    runCount + 1,
  );
};

const solve: AOCSolver = (input) => {
  const grid = parse(input);
  const part1 = runFor(grid, 100);
  const part2 = runUntilSync(grid);
  return { part1, part2 };
};

export default solve;

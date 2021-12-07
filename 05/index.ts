import { AOCSolver } from "../aoc.ts";
import { getRange } from "../utils.ts";
// import { getExample, getInput } from "../aoc.ts";

interface Point {
  x: number;
  y: number;
}
type Line = [from: Point, to: Point];
type LineType =
  | "v" // vertical
  | "h" // horizontal
  | "/" // diagonal y = x + c
  | "\\"; // diagonal y = -x + c

const parse = (input: string) => {
  return input.split("\n").map(
    (ln) =>
      ln.split(" -> ")
        .map((xy) => xy.split(","))
        .map(([x, y]) => ({ x: Number(x), y: Number(y) })) as Line,
  );
};

/** put point with smallest value first (leftmost for diagonal) */
const normalise = (line: Line): Line => {
  const lineType = getLineType(line);
  if (lineType === "v") {
    // topmost first
    return line[0].y < line[1].y ? line : [line[1], line[0]];
  }
  // leftmost first
  return line[0].x < line[1].x ? line : [line[1], line[0]];
};

const getLineType = ([from, to]: Line): LineType => {
  if (from.x === to.x) return "v";
  if (from.y === to.y) return "h";
  if (from.y > to.y) return "/";
  return "\\";
};

// expects lines to be normalised
const getIntersection = (a: Line, b: Line): Line | null => {
  const [aType, bType] = [a, b].map(getLineType);

  // two horizontal lines
  if (aType === "h" && bType === "h") {
    // are they on the same horizontal plane
    if (a[0].y !== b[0].y) {
      return null;
    }
    // which line begins furthest to left
    const [left, right] = a[0].x < b[0].x ? [a, b] : [b, a];
    // if lefts's last point is further left than (or the same as) right's first point then theres overlap
    if (left[1].x >= right[0].x) {
      const firstPoint = left[0].x > right[0].x
        ? { ...left[0] }
        : { ...right[0] };
      const lastPoint = left[1].x < right[1].x
        ? { ...left[1] }
        : { ...right[1] };
      const line: Line = [firstPoint, lastPoint];
      return line;
    } else {
      return null;
    }
  }

  // two vertical lines
  if (aType === "v" && bType === "v") {
    // are they on the same vertical plane
    if (a[0].x !== b[0].x) {
      return null;
    }
    // which line is begins higher up (top)
    const [top, bottom] = a[0].y < b[0].y ? [a, b] : [b, a];
    // if top's last point is lower than (or the same as) bottoms first point
    if (top[1].y >= bottom[0].y) {
      const firstPoint = top[0].y > bottom[0].y
        ? { ...top[0] }
        : { ...bottom[0] };
      const lastPoint = top[1].y < bottom[1].y
        ? { ...top[1] }
        : { ...bottom[1] };
      const line: Line = [firstPoint, lastPoint];
      return line;
    } else {
      return null;
    }
  }

  // one vertical, one horizontal
  if (["h", "v"].includes(aType) && ["h", "v"].includes(bType)) {
    const [vLine, hLine] = aType === "v" ? [a, b] : [b, a];
    if (
      hLine[0].y >= vLine[0].y && hLine[0].y <= vLine[1].y &&
      vLine[0].x >= hLine[0].x && vLine[0].x <= hLine[1].x
    ) {
      const point: Point = { x: vLine[0].x, y: hLine[0].y };
      return [point, point] as Line;
    } else {
      return null;
    }
  }
  throw Error("no match");
};

const getPoints = (line: Line): Point[] => {
  const [from, to] = line;
  if (getLineType(line) === "h") {
    return getRange(from.x, to.x).map((x) => ({ x, y: from.y } as Point));
  }
  if (getLineType(line) === "v") {
    return getRange(from.y, to.y).map((y) => ({ x: from.x, y } as Point));
  }
  throw Error("cant handle diagonal");
};

const asString = ({ x, y }: Point) => `${x},${y}`;

const getPart1 = (lines: Line[]) => {
  // remove diagonals and normalise
  const processed = lines.filter((line) =>
    ["h", "v"].includes(getLineType(line))
  ).map(normalise);
  // get all intersctions
  const intersections = processed.reduce<Line[]>((arr, line, i, origArr) => {
    if (i === origArr.length - 1) return arr; // skip last line
    const intersections = getRange(i + 1, origArr.length - 1).map((i) =>
      origArr[i]
    ).map((otherLine) => getIntersection(line, otherLine));
    return [...arr, ...intersections.filter((x) => x !== null) as Line[]];
  }, []);
  console.log(intersections);
  // extract the points
  const points = intersections.map(getPoints).flat().map(asString);
  return new Set(points).size; // remove duplicates
};

const solve: AOCSolver = (input) => {
  const lines = parse(input);
  const part1 = getPart1(lines);
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(5)));
// console.log(solve(await getInput(5)));

export default solve;

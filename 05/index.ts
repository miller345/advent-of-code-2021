import { AOCSolver } from "../aoc.ts";
// import { getExample, getInput } from "../aoc.ts";

interface Point {
  x: number;
  y: number;
}
type Line = [from: Point, to: Point];
type LineType = "horizontal" | "vertical" | "diagonal";

const parse = (input: string) => {
  return input.split("\n").map(
    (ln) =>
      ln.split(" -> ")
        .map((xy) => xy.split(","))
        .map(([x, y]) => ({ x: Number(x), y: Number(y) })) as Line,
  );
};

/** put point with smallest value first */
const normalise = (line: Line): Line => {
  const lineType = getLineType(line);
  if (lineType === "horizontal") {
    return line[0].x < line[1].x ? line : [line[1], line[0]];
  }
  if (lineType === "vertical") {
    return line[0].y < line[1].y ? line : [line[1], line[0]];
  }
  throw Error("doesnt handle diagonal");
};

const getRange = (from: number, to: number) => {
  const [low, high] = to > from ? [from, to] : [to, from];
  return [...Array(high - low + 1).keys()].map((i) => i + low);
};

const getLineType = ([from, to]: Line): LineType => {
  if (from.x === to.x) return "vertical";
  if (from.y === to.y) return "horizontal";
  return "diagonal";
};

// expects lines to be normalised
const getIntersection = (a: Line, b: Line): Line | null => {
  const [aType, bType] = [a, b].map(getLineType);
  if (aType === "diagonal" || bType === "diagonal") {
    throw Error("cant handle diagonal");
  }
  if (aType === bType) {
    if (aType === "horizontal") {
      if (a[0].y !== b[0].y) {
        // console.log("no H1", a.map(asString), b.map(asString));
        return null;
      }
      const [left, right] = a[0].x < b[0].x ? [a, b] : [b, a];
      if (left[1].x >= right[0].x) {
        const firstPoint = left[0].x > right[0].x
          ? { ...left[0] }
          : { ...right[0] };
        const lastPoint = left[1].x < right[1].x
          ? { ...left[1] }
          : { ...right[1] };
        const line: Line = [firstPoint, lastPoint];
        // console.log(
        //   "HHHH",
        //   left.map(asString),
        //   right.map(asString),
        //   line.map(asString),
        // );
        return line;
      } else {
        // console.log("no H2", left.map(asString), right.map(asString));
        return null;
      }
    }
    if (aType === "vertical") {
      if (a[0].x !== b[0].x) {
        // console.log("no V1", a.map(asString), b.map(asString));
        return null;
      }
      const [top, bottom] = a[0].y < b[0].y ? [a, b] : [b, a];
      // if top's last point is lower than (or the same as) bottoms first point
      if (top[1].y >= bottom[0].y) {
        // const firstPoint = { ...bottom[0] };
        const firstPoint = top[0].y > bottom[0].y
          ? { ...top[0] }
          : { ...bottom[0] };
        const lastPoint = top[1].y < bottom[1].y
          ? { ...top[1] }
          : { ...bottom[1] };
        const line: Line = [firstPoint, lastPoint];
        // console.log(
        //   "VVV",
        //   top.map(asString),
        //   bottom.map(asString),
        //   line.map(asString),
        // );
        return line;
      } else {
        // console.log("no V2", a, b);
        return null;
      }
    }
  } else {
    const [vLine, hLine] = aType === "vertical" ? [a, b] : [b, a];
    if (
      hLine[0].y >= vLine[0].y && hLine[0].y <= vLine[1].y &&
      vLine[0].x >= hLine[0].x && vLine[0].x <= hLine[1].x
    ) {
      const point: Point = { x: vLine[0].x, y: hLine[0].y };
      // console.log("CROSS", a, b, point);
      return [point, point] as Line;
    } else {
      // console.log("no cross", vLine, hLine);
      return null;
    }
  }
  throw Error("no match");
};

const getPoints = (line: Line): Point[] => {
  const [from, to] = line;
  if (getLineType(line) === "horizontal") {
    return getRange(from.x, to.x).map((x) => ({ x, y: from.y } as Point));
  }
  if (getLineType(line) === "vertical") {
    return getRange(from.y, to.y).map((y) => ({ x: from.x, y } as Point));
  }
  throw Error("cant handle diagonal");
};

const asString = ({ x, y }: Point) => `${x},${y}`;

const getPart1 = (lines: Line[]) => {
  // remove diagonals and normalise
  const processed = lines.filter((line) => getLineType(line) !== "diagonal")
    .map(
      normalise,
    );
  const intersections = processed.reduce<Line[]>((arr, line, i, origArr) => {
    if (i === origArr.length - 1) return arr; // skip last line
    const intersections = getRange(i + 1, origArr.length - 1).map((i) =>
      origArr[i]
    ).map((otherLine) => getIntersection(line, otherLine));
    return [...arr, ...intersections.filter((x) => x !== null) as Line[]];
  }, []);
  const points = intersections.map(getPoints).flat().map(asString);
  return new Set(points).size;
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

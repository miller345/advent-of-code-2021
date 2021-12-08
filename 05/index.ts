import { AOCSolver } from "../aoc.ts";
import { getRange } from "../utils.ts";

interface Point {
  x: number;
  y: number;
}
type Line = [from: Point, to: Point];
type LineType =
  | "v" // vertical
  | "h" // horizontal
  | "/" // diagonal y = -x + c
  | "\\"; // diagonal y = x + c

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const parse = (input: string) => {
  return input.split("\n").map(
    (ln) =>
      ln.split(" -> ")
        .map((xy) => xy.split(","))
        .map(([x, y]) => ({ x: Number(x), y: Number(y) })) as Line,
  );
};

const getLineType = (line: Line): LineType => {
  const { minX, maxX, minY, maxY } = getBounds(line);
  if (minX === maxX) return "v";
  if (minY === maxY) return "h";
  const [minXPoint, maxXPoint] = line[0].x === minX
    ? [line[0], line[1]]
    : [line[1], line[0]];
  if (minXPoint.y > maxXPoint.y) return "/";
  return "\\";
};

const getBounds = (line: Line): Bounds => ({
  minX: Math.min(line[0].x, line[1].x),
  maxX: Math.max(line[0].x, line[1].x),
  minY: Math.min(line[0].y, line[1].y),
  maxY: Math.max(line[0].y, line[1].y),
});

const getCommonBounds = (a: Line, b: Line): Bounds | null => {
  const boundsA = getBounds(a);
  const boundsB = getBounds(b);
  const minX = Math.max(boundsA.minX, boundsB.minX);
  const maxX = Math.min(boundsA.maxX, boundsB.maxX);
  if (minX > maxX) return null;
  const minY = Math.max(boundsA.minY, boundsB.minY);
  const maxY = Math.min(boundsA.maxY, boundsB.maxY);
  if (minY > maxY) return null;
  return { minX, maxX, minY, maxY };
};

const isPointInBounds = (
  { x, y }: Point,
  { minX, maxX, minY, maxY }: Bounds,
): boolean => x >= minX && x <= maxX && y >= minY && y <= maxY;

const getC = (line: Line) => {
  const lineType = getLineType(line);
  if (lineType === "/") {
    // y = -x + c
    return line[0].y + line[0].x;
  }
  if (lineType === "\\") {
    // y = x + c
    return line[0].y - line[0].x;
  }
  throw Error("cannot get C for type");
};

const getX = (line: Line, y?: number) => {
  const lineType = getLineType(line);
  if (lineType === "h") throw Error("cant get X for horizontal");
  if (lineType === "v") return line[0].x;
  if (lineType === "/") {
    if (y === undefined) throw Error("must supply Y for /");
    // y = -x + c
    return getC(line) - y;
  }
  if (lineType === "\\") {
    if (y === undefined) throw Error("must supply Y for /");
    // y = x + c
    return y - getC(line);
  }
  throw Error("cannot get X");
};

const getY = (line: Line, x?: number) => {
  const lineType = getLineType(line);
  if (lineType === "h") return line[0].y;
  if (lineType === "v") throw Error("cant get Y for vertical");
  if (lineType === "/") {
    if (x === undefined) throw Error("must supply X for /");
    // y = -x + c
    return getC(line) - x;
  }
  if (lineType === "\\") {
    if (x === undefined) throw Error("must supply X for /");
    // y = x + c
    return getC(line) + x;
  }
  throw Error("cannot get Y");
};

const getIntersectionPointIgnoreBounds = (a: Line, b: Line): Point => {
  const [aType, bType] = [a, b].map(getLineType);
  if (aType === bType) throw Error("different types only");
  // one horizontal, and (a vertical or diagonal)
  if ([aType, bType].includes("h")) {
    const [hLine, line] = aType === "h" ? [a, b] : [b, a];
    const y = getY(hLine);
    const x = getX(line, y);
    return { x, y };
  }
  // one vertical, and a diagonal
  if ([aType, bType].includes("v")) {
    const [vLine, line] = aType === "v" ? [a, b] : [b, a];
    const x = getX(vLine);
    const y = getY(line, x);
    return { x, y };
  }

  // 2 diagonals (a / and a \) - note this can return a decimal intersection
  const [forwardLine, backLine] = aType === "/" ? [a, b] : [b, a];
  // y = -x + cF
  // y = x + cB
  // 2y = cF + cB
  const [cF, cB] = [forwardLine, backLine].map(getC);
  const y = (cF + cB) / 2;
  const x = getX(forwardLine, y);
  return { x, y };
};

const getIntersection = (a: Line, b: Line): Line | null => {
  const [aType, bType] = [a, b].map(getLineType);
  const bounds = getCommonBounds(a, b);
  if (bounds === null) return null; //  no common bounds
  // same types
  if (aType === bType) {
    const { minX, maxX, minY, maxY } = bounds;
    // check same plane for diagonal
    if (["/", "\\"].includes(aType)) {
      const [aC, bC] = [a, b].map(getC);
      if (aC !== bC) return null; // not on same plane
    }
    if (aType === "/") {
      return [{ x: minX, y: maxY }, { x: maxX, y: minY }];
    }
    return [{ x: minX, y: minY }, { x: maxX, y: maxY }];
  }
  // different types
  const point = getIntersectionPointIgnoreBounds(a, b);
  if (!Number.isInteger(point.x)) return null; // non integer cross
  return isPointInBounds(point, bounds) ? [point, point] : null;
};

const getPoints = (line: Line): Point[] => {
  const { minX, maxX, minY, maxY } = getBounds(line);
  return getLineType(line) === "v"
    ? getRange(minY, maxY).map((y) => ({ x: getX(line, y), y }))
    : getRange(minX, maxX).map((x) => ({ x, y: getY(line, x) }));
};

const asString = ({ x, y }: Point) => `${x},${y}`;

const getIntersectionCount = (lines: Line[]) => {
  // get all intersections
  const intersections = lines.reduce<Line[]>((arr, line, i, origArr) => {
    if (i === origArr.length - 1) return arr; // skip last line
    const intersections = getRange(i + 1, origArr.length - 1).map((i) =>
      origArr[i]
    ).map((otherLine) => getIntersection(line, otherLine));
    return [...arr, ...intersections.filter((x) => x !== null) as Line[]];
  }, []);
  // extract the points
  const points = intersections.map(getPoints).flat().map(asString);
  return new Set(points).size; // remove duplicates
};

const solve: AOCSolver = (input) => {
  const lines = parse(input);
  // remove diagonals
  const filtered = lines.filter((line) =>
    ["h", "v"].includes(getLineType(line))
  );
  const part1 = getIntersectionCount(filtered);
  const part2 = getIntersectionCount(lines);
  return { part1, part2 };
};

export default solve;

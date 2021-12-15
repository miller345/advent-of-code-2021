import { AOCSolver } from "../aoc.ts";
import { getRange } from "../utils.ts";

type Point = { x: number; y: number };
type Fold = { axis: "x" | "y"; value: number };

const parse = (input: string) => {
  const coords = input.split("\n\n")[0].split("\n").map((line) =>
    line.split(",").reduce<Point>(
      (obj, v, i) => ({ ...obj, [i === 0 ? "x" : "y"]: Number(v) }),
      {} as Point,
    )
  );
  const folds = input.split("\n\n")[1].split("\n").map((line) =>
    line.split(" ")[2].split("=").reduce<Fold>(
      (obj, v, i) => ({
        ...obj,
        [i === 0 ? "axis" : "value"]: i === 0 ? v : Number(v),
      }),
      {} as Fold,
    )
  );
  return { coords, folds };
};

const asString = ({ x, y }: Point) => `${x},${y}`;

const fold = (points: Point[], fold: Fold) =>
  points.reduce<Point[]>((arr, point) => {
    let newPoint = point;
    if (fold.axis === "y" && point.y > fold.value) {
      newPoint = {
        x: point.x,
        y: fold.value - (point.y - fold.value),
      };
    }
    if (fold.axis === "x" && point.x > fold.value) {
      newPoint = {
        x: fold.value - (point.x - fold.value),
        y: point.y,
      };
    }
    return (arr.map(asString).includes(asString(newPoint)))
      ? arr
      : [...arr, newPoint];
  }, []);

const keepFolding = (points: Point[], folds: Fold[]): Point[] =>
  folds.length === 0
    ? points
    : keepFolding(fold(points, folds[0]), folds.slice(1));

const printablePoints = (points: Point[]) => {
  const maxX = Math.max(...points.map(({ x }) => x));
  const maxY = Math.max(...points.map(({ y }) => y));
  return getRange(0, maxY).map((y) => {
    return getRange(0, maxX).map((x) =>
      points.map(asString).includes(asString({ x, y })) ? "#" : "."
    ).join("");
  }).join("\n");
};

const solve: AOCSolver = (input) => {
  const { coords, folds } = parse(input);
  const part1 = fold(coords, folds[0]).length;
  const part2 = printablePoints(keepFolding(coords, folds));
  return { part1, part2 };
};

export default solve;

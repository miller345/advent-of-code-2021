import { AOCSolver } from "../aoc.ts";
import {
  Char,
  CloseChar,
  isChar,
  isCloseChar,
  isOpenChar,
  isWrongCloseCharError,
  Line,
  OpenChar,
  ParseLineError,
} from "./types.ts";
// import { getExample, getInput } from "../aoc.ts";

const parse = (input: string): Line[] => {
  return input.split("\n").map((l) =>
    l.split("").map((c) => {
      if (isChar(c)) return c;
      throw Error("parse error");
    })
  );
};

const _pairs: [OpenChar, CloseChar][] = [
  ["(", ")"],
  ["<", ">"],
  ["[", "]"],
  ["{", "}"],
];
const isPair = (open: OpenChar, close: CloseChar) =>
  _pairs.map(([o, c]) => o + c).includes(open + close);
const getCloseChar = (open: OpenChar) => _pairs.find(([o]) => o === open)![1];

const parseLine = (
  line: Line,
  openChunks: OpenChar[] = [],
  step = 0,
): true | ParseLineError => {
  if (step === line.length) return true; // done
  const char: Char = line[step];
  if (isOpenChar(char)) {
    return parseLine(line, [...openChunks, char], step + 1);
  }
  if (isCloseChar(char)) {
    if (openChunks.length === 0) return { type: "no open chunks", char, step };
    const open = openChunks[openChunks.length - 1];
    if (!isPair(open, char)) {
      return {
        type: "wrong close char",
        step,
        char,
        expectedChar: getCloseChar(open),
      };
    }
    return parseLine(line, openChunks.slice(0, -1), step + 1);
  }
  throw Error("parseLine: invalid char");
};

const parseLines = (lines: Line[]) => {
  return lines.map((line) => {
    return parseLine(line);
  });
};

const getScore = (char: CloseChar) => {
  if (char === ")") return 3;
  if (char === "]") return 57;
  if (char === "}") return 1197;
  if (char === ">") return 25137;
  throw Error("score error");
};

const getPart1 = (lines: Line[]) =>
  parseLines(lines).reduce(
    (score, res) => {
      if (res === true) return score;
      if (isWrongCloseCharError(res)) return getScore(res.char) + score;
      return score;
    },
    0,
  );

const solve: AOCSolver = (input) => {
  const lines = parse(input);
  const part1 = getPart1(lines);
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(10)));
// console.log(solve(await getInput(10)));

export default solve;

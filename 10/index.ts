import { AOCSolver } from "../aoc.ts";

const _openChars = ["(", "[", "{", "<"] as const;
type OpenChar = typeof _openChars[number];
function isOpenChar(v: string): v is OpenChar {
  return _openChars.includes(v as OpenChar);
}

const _closeChars = [")", "]", "}", ">"] as const;
type CloseChar = typeof _closeChars[number];
function isCloseChar(v: string): v is OpenChar {
  return _closeChars.includes(v as CloseChar);
}

type Char = OpenChar | CloseChar;
function isChar(v: string): v is Char {
  return isOpenChar(v) || isCloseChar(v);
}

type Line = Char[];

interface WrongCloseCharError {
  char: CloseChar;
  expectedChar: CloseChar;
}

const parse = (input: string): Line[] =>
  input.split("\n").map((l) =>
    l.split("").map((c) => {
      if (isChar(c)) return c;
      throw Error("parse error");
    })
  );

const isPair = (open: OpenChar, close: CloseChar) =>
  _openChars.indexOf(open) === _closeChars.indexOf(close);
const getCloseChar = (open: OpenChar) => _closeChars[_openChars.indexOf(open)];

const parseLine = (
  line: Line,
  openChunks: OpenChar[] = [],
  step = 0,
):
  | CloseChar[] // missing close chars
  | WrongCloseCharError => {
  if (step === line.length) {
    return [...openChunks].reverse().map((open) => getCloseChar(open));
  }
  const char: Char = line[step];
  if (isOpenChar(char)) {
    return parseLine(line, [...openChunks, char], step + 1);
  }
  if (isCloseChar(char)) {
    if (openChunks.length === 0) throw Error("parseLine: no open chunks");
    const open = openChunks[openChunks.length - 1];
    if (!isPair(open, char)) {
      return { char, expectedChar: getCloseChar(open) };
    }
    return parseLine(line, openChunks.slice(0, -1), step + 1);
  }
  throw Error("parseLine: invalid char");
};

const parseLines = (lines: Line[]) => lines.map((line) => parseLine(line));

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
      if (Array.isArray(res)) return score;
      return getScore(res.char) + score;
    },
    0,
  );

const getScore2 = (chars: CloseChar[]) =>
  chars.reduce(
    (score, char) => (score * 5) + [")", "]", "}", ">"].indexOf(char) + 1,
    0,
  );

const getPart2 = (lines: Line[]) => {
  const scores = parseLines(lines).reduce<number[]>(
    (arr, res) => {
      if (Array.isArray(res)) return [...arr, getScore2(res)];
      return arr;
    },
    [],
  ).sort((a, b) => a - b);
  return scores[(scores.length - 1) / 2];
};

const solve: AOCSolver = (input) => {
  const lines = parse(input);
  const part1 = getPart1(lines);
  const part2 = getPart2(lines);
  return { part1, part2 };
};

export default solve;

import { AOCSolver } from "../aoc.ts";
// import { getExample, getInput } from "../aoc.ts";

type Signal = string[];
type Entry = { signals: Signal[]; output: Signal[] };

const parse = (input: string): Entry[] => {
  const regex = /(?<line1>.+)\s[|][\n\s](?<line2>.+)/gm;
  return [...input.matchAll(regex)].map(([_, line1, line2]) => ({
    signals: line1.split(" ").map((x) => x.split("")),
    output: line2.split(" ").map((x) => x.split("")),
  }));
};

const getPart1 = (entries: Entry[]) => {
  const get1478Count = ({ output }: Entry) =>
    output.filter((signal) => [2, 4, 3, 7].includes(signal.length)).length;
  return entries.reduce((total, entry) => get1478Count(entry) + total, 0);
};

const solve: AOCSolver = (input) => {
  const entries = parse(input);
  const part1 = getPart1(entries);
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(8)));
// console.log(solve(await getInput(8)));

export default solve;

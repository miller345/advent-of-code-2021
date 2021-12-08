import { AOCSolver } from "../aoc.ts";

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

const exclude = <T>(array: T[], exclude: T[]): T[] =>
  array.filter((v) => !exclude.includes(v));

/** merge (and dedupe) */
const merge = <T>(a: T[], b: T[]) => [...new Set([...a, ...b])];

const equals = (a: string[], b: string[]) =>
  [...a].sort().join("") === [...b].sort().join("");

const decode = ({ signals, output }: Entry) => {
  const one = signals.find((s) => s.length === 2)!;
  const four = signals.find((s) => s.length === 4)!;
  const seven = signals.find((s) => s.length === 3)!;
  const eight = signals.find((s) => s.length === 7)!;
  const _0_6_9 = signals.filter((s) => s.length === 6); // zero six or nine
  const _2_3_5 = signals.filter((s) => s.length === 5); // two three or five
  const a = exclude(seven, one)[0];
  const g =
    _2_3_5.map((s) => exclude(s, merge(one, merge(four, seven)))).filter((s) =>
      s.length === 1
    )[0][0];
  const nine = signals.find((s) => equals(s, [...four, a, g]))!;
  const e = exclude(eight, [...four, a, g])[0];
  const two =
    _2_3_5[_2_3_5.map((s) => exclude(s, [e])).findIndex((s) => s.length === 4)];
  const f = exclude(seven, two)[0];
  const c = exclude(seven, [f, a])[0];
  const b =
    _0_6_9.map((s) => exclude(s, [a, c, e, f, g])).find((s) =>
      s.length === 1
    )![0];
  const d = exclude(eight, [a, b, c, e, f, g])[0];
  const zero = [a, b, c, e, f, g];
  const three = [a, c, d, f, g];
  const five = [a, b, d, f, g];
  const six = [a, b, d, e, f, g];
  const nums = {
    [[...zero].sort().join("")]: 0,
    [[...one].sort().join("")]: 1,
    [[...two].sort().join("")]: 2,
    [[...three].sort().join("")]: 3,
    [[...four].sort().join("")]: 4,
    [[...five].sort().join("")]: 5,
    [[...six].sort().join("")]: 6,
    [[...seven].sort().join("")]: 7,
    [[...eight].sort().join("")]: 8,
    [[...nine].sort().join("")]: 9,
  };
  return Number(
    output.map((s) => nums[[...s].sort().join("")]).map((n) => n.toString())
      .join(""),
  );
};

const getPart2 = (entries: Entry[]) => {
  return entries.map(decode).reduce((a, b) => a + b, 0);
};

const solve: AOCSolver = (input) => {
  const entries = parse(input);
  const part1 = getPart1(entries);
  const part2 = getPart2(entries);
  return { part1, part2 };
};

export default solve;

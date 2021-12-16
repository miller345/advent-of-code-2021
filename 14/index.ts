import { AOCSolver } from "../aoc.ts";

type Rule = [pair: string, insert: string];

const parse = (input: string) => {
  const template = input.split("\n\n")[0];
  const rules = input.split("\n\n")[1].split("\n").map((line) =>
    line.split(" -> ") as Rule
  );
  return { template, rules };
};

const getRuleForPair = (pair: string, rules: Rule[]) => {
  const rule = rules.find((r) => r[0] === pair);
  if (rule === undefined) throw Error("cannot find rule " + pair);
  return rule;
};

/** get the two reulting pairs after inserting the char */
const getResultingPairs = (
  [pair, insert]: Rule,
) => [pair.split("")[0] + insert, insert + pair.split("")[1]] as const;

const templateAsPairCount = (template: string) =>
  template.split("").reduce<Record<string, number>>((obj, _, i, arr) => {
    if (i === arr.length - 1) return obj;
    const pair = arr[i] + arr[i + 1];
    return { ...obj, [pair]: (obj[pair] ?? 0) + 1 };
  }, {});

/** get the next template (as a pair count) after running the rules once */
const getNextTemplate = (
  template: Record<string, number>,
  rules: Rule[],
): Record<string, number> => {
  return Object.entries(template).reduce<Record<string, number>>(
    (obj, [pair, count]) => {
      const rule = getRuleForPair(pair, rules);
      const [p1, p2] = getResultingPairs(rule);
      if (p1 === p2) {
        return {
          ...obj,
          [p1]: (obj[p1] ?? 0) + count * 2,
        };
      }
      return {
        ...obj,
        [p1]: (obj[p1] ?? 0) + count,
        [p2]: (obj[p2] ?? 0) + count,
      };
    },
    {},
  );
};

const runFor = (
  template: Record<string, number>,
  rules: Rule[],
  maxRuns: number,
  runs = 0,
): Record<string, number> => {
  if (maxRuns === runs) return template;
  const nextTemplate = getNextTemplate(template, rules);
  return runFor(nextTemplate, rules, maxRuns, runs + 1);
};

const pairCountToCharCount = (
  pairCounts: Record<string, number>,
): Record<string, number> => {
  const charCounts = Object.entries(pairCounts).reduce<Record<string, number>>(
    (obj, [pair, count]) => {
      const [c1, c2] = pair.split("");
      if (c1 === c2) {
        return {
          ...obj,
          [c1]: (obj[c1] ?? 0) + count,
        };
      }
      return {
        ...obj,
        [c1]: (obj[c1] ?? 0) + (count / 2),
        [c2]: (obj[c2] ?? 0) + (count / 2),
      };
    },
    {},
  );
  // round up because the chars on each end come out as .5
  return Object.entries(charCounts).reduce<Record<string, number>>(
    (obj, [char, count]) => {
      return { ...obj, [char]: Math.ceil(count) };
    },
    {},
  );
};

const getResult = (template: string, rules: Rule[], runs: number) => {
  const pairCount = runFor(templateAsPairCount(template), rules, runs);
  const charCount = pairCountToCharCount(pairCount);
  const counts = Object.values(charCount);
  const mostCommon =
    Object.entries(charCount)[counts.indexOf(Math.max(...counts))];
  const leastCommon =
    Object.entries(charCount)[counts.indexOf(Math.min(...counts))];
  return mostCommon[1] - leastCommon[1];
};

const solve: AOCSolver = (input) => {
  const { template, rules } = parse(input);
  const part1 = getResult(template, rules, 10);
  const part2 = getResult(template, rules, 40);
  return { part1, part2 };
};

export default solve;

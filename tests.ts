import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { AOCResult, AOCSolver, getExample, getInput } from "./aoc.ts";
import day1 from "./01/index.ts";
import day2 from "./02/index.ts";
import day3 from "./03/index.ts";
import day4 from "./04/index.ts";
import day5 from "./05/index.ts";
import day6 from "./06/index.ts";
import day7 from "./07/index.ts";
import day8 from "./08/index.ts";
import day9 from "./09/index.ts";
import day10 from "./10/index.ts";
import day11 from "./11/index.ts";
import day12 from "./12/index.ts";
// import day13 from "./13/index.ts";
// import day14 from "./14/index.ts";
// import day15 from "./15/index.ts";
// import day16 from "./16/index.ts";
// import day17 from "./17/index.ts";
// import day18 from "./18/index.ts";
// import day19 from "./19/index.ts";
// import day20 from "./20/index.ts";
// import day21 from "./21/index.ts";
// import day22 from "./22/index.ts";
// import day23 from "./23/index.ts";
// import day24 from "./24/index.ts";
// import day25 from "./25/index.ts";

const testDay = (
  day: number,
  solver: AOCSolver,
  input: [AOCResult, any?],
  example?: [AOCResult, any?],
) => {
  if (example) {
    Deno.test(`Day ${day} (example)`, async () => {
      assertEquals(solver(await getExample(day), example[1]), example[0]);
    });
  }
  Deno.test(`Day ${day}`, async () => {
    assertEquals(solver(await getInput(day), input[1]), input[0]);
  });
};

const tests: [number, AOCSolver, [AOCResult, any?], [AOCResult, any?]?][] = [
  [1, day1, [{ part1: 1676, part2: 1706 }], [{ part1: 7, part2: 5 }]],
  [
    2,
    day2,
    [{ part1: 1383564, part2: 1488311643 }],
    [{ part1: 150, part2: 900 }],
  ],
  [3, day3, [{ part1: 1458194, part2: 2829354 }], [{ part1: 198, part2: 230 }]],
  [4, day4, [{ part1: 72770, part2: 13912 }], [{ part1: 4512, part2: 1924 }]],
  [5, day5, [{ part1: 8622, part2: 22037 }], [{ part1: 5, part2: 12 }]],
  [6, day6, [{ part1: 359344, part2: 1629570219571 }], [{
    part1: 5934,
    part2: 26984457539,
  }]],
  [7, day7, [{ part1: 352997, part2: 101571302 }], [{ part1: 37, part2: 168 }]],
  [8, day8, [{ part1: 383, part2: 998900 }], [{ part1: 26, part2: 61229 }]],
  [9, day9, [{ part1: 502, part2: 1330560 }], [{ part1: 15, part2: 1134 }]],
  [10, day10, [{ part1: 299793, part2: 3654963618 }], [{
    part1: 26397,
    part2: 288957,
  }]],
  [11, day11, [{ part1: 1749, part2: 285 }], [{ part1: 1656, part2: 195 }]],
  [12, day12, [{ part1: 4304, part2: 118242 }], [{ part1: 226, part2: 3509 }]],
  // [13, day13, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [14, day14, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [15, day15, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [16, day16, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [17, day17, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [18, day18, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [19, day19, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [20, day20, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [21, day21, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [22, day22, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [23, day23, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [24, day24, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
  // [25, day25, [{ part1: 0, part2: 0 }], [{ part1: 0, part2: 0 }]],
];

tests.forEach((x) => testDay(...x));

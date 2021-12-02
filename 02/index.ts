import { AOCSolver } from "../aoc.ts";

type Direction = "forward" | "down" | "up";
type Instruction = [Direction, number];

const parse = (input: string): Instruction[] => {
  return input.split("\n").map((line) => {
    const arr = line.split(" ");
    return [arr[0] as Direction, Number(arr[1])];
  });
};

const getPart1Values = (instructions: Instruction[]) =>
  instructions.reduce<{
    depth: number;
    horizontal: number;
  }>(
    ({ depth, horizontal }, [direction, value]) => {
      const depthChange =
        direction === "down" ? value : direction === "up" ? -value : 0;
      const horizontalChange = direction === "forward" ? value : 0;
      return {
        depth: depth + depthChange,
        horizontal: horizontal + horizontalChange,
      };
    },
    { depth: 0, horizontal: 0 }
  );

const getPart2Values = (instructions: Instruction[]) =>
  instructions.reduce<{
    depth: number;
    horizontal: number;
    aim: number;
  }>(
    ({ depth, horizontal, aim }, [direction, value]) => {
      const aimChange =
        direction === "down" ? value : direction === "up" ? -value : 0;
      const depthChange = direction === "forward" ? aim * value : 0;
      const horizontalChange = direction === "forward" ? value : 0;
      return {
        depth: depth + depthChange,
        horizontal: horizontal + horizontalChange,
        aim: aim + aimChange,
      };
    },
    { depth: 0, horizontal: 0, aim: 0 }
  );

const solve: AOCSolver = (input) => {
  const parsed = parse(input);
  const part1Values = getPart1Values(parsed);
  const part2Values = getPart2Values(parsed);
  const part1 = part1Values.depth * part1Values.horizontal;
  const part2 = part2Values.depth * part2Values.horizontal;
  return { part1, part2 };
};

export default solve;

import { AOCSolver } from "../aoc.ts";
import { getExample, getInput } from "../aoc.ts";

type Bit = 0 | 1;
type Instruction = Bit[];

const parse = (input: string): Instruction[] => {
  return input
    .split("\n")
    .map((line) => line.split("").map<Bit>((v) => (v === "1" ? 1 : 0)));
};

const mostCommonBitAtIndex = (
  instructions: Instruction[],
  index: number
): Bit => {
  const bits = instructions.map((instruction) => instruction[index]);
  const sum = bits.reduce<number>((a, b) => a + b, 0);
  return sum > instructions.length / 2 ? 1 : 0;
};

const toDec = (instruction: Instruction) => parseInt(instruction.join(""), 2);

const getPart1Values = (instructions: Instruction[]) => {
  const instructionLength = instructions[0].length;
  const gammaBits = [...Array(instructionLength).keys()].map((i) =>
    mostCommonBitAtIndex(instructions, i)
  );
  const epsilonBits = gammaBits.map<Bit>((v) => (v ? 0 : 1));
  return { gamma: toDec(gammaBits), epsilon: toDec(epsilonBits) };
};

const solve: AOCSolver = (input) => {
  const instructions = parse(input);
  const { gamma, epsilon } = getPart1Values(instructions);
  const part1 = gamma * epsilon;
  const part2 = 0;
  return { part1, part2 };
};

console.log(solve(await getExample(3)));
console.log(solve(await getInput(3)));

export default solve;

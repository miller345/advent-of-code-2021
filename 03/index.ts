import { AOCSolver } from "../aoc.ts";

type Bit = 0 | 1;
type Instruction = Bit[];

const parse = (input: string): Instruction[] => {
  return input
    .split("\n")
    .map((line) => line.split("").map<Bit>((v) => (v === "1" ? 1 : 0)));
};

const mostCommonBitAtIndex = (
  instructions: Instruction[],
  index: number,
): Bit => {
  const bits = instructions.map((instruction) => instruction[index]);
  const sum = bits.reduce<number>((a, b) => a + b, 0);
  return sum >= instructions.length / 2 ? 1 : 0;
};

const filterForBitsAtIndex = (
  instructions: Instruction[],
  value: Bit,
  index: number,
) => {
  return instructions.filter((instruction) => instruction[index] === value);
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

const getOxygen = (instructions: Instruction[]) => {
  let index = 0;
  let values = instructions;
  while (values.length > 1) {
    values = filterForBitsAtIndex(
      values,
      mostCommonBitAtIndex(values, index),
      index,
    );
    index++;
  }
  return toDec(values[0]);
};

const getCO2 = (instructions: Instruction[]) => {
  let index = 0;
  let values = instructions;
  while (values.length > 1) {
    values = filterForBitsAtIndex(
      values,
      mostCommonBitAtIndex(values, index) === 1 ? 0 : 1, // least common
      index,
    );
    index++;
  }
  return toDec(values[0]);
};

const getPart2Values = (instructions: Instruction[]) => {
  return { oxygen: getOxygen(instructions), cO2: getCO2(instructions) };
};

const solve: AOCSolver = (input) => {
  const instructions = parse(input);
  const { gamma, epsilon } = getPart1Values(instructions);
  const part1 = gamma * epsilon;
  const { oxygen, cO2 } = getPart2Values(instructions);
  const part2 = oxygen * cO2;
  return { part1, part2 };
};

export default solve;

import { AOCSolver } from "../aoc.ts";

const parse = (input: string) => input.split("\n").map(Number);

const solve: AOCSolver = (input) => {
  const values = parse(input);
  const countIncreases = (values: number[]) =>
    values.reduce((total, value, i, arr) => {
      if (i === 0) return total; // ignore the first value
      const prevValue = arr[i - 1];
      if (value > prevValue) return total + 1;
      return total;
    }, 0);
  const part1 = countIncreases(values);
  const summedValues = values.reduce<number[]>(
    (summedValues, value, i, arr) => {
      if (i + 2 >= arr.length) return summedValues; // ignore the last two values
      const threeValues = [value, arr[i + 1], arr[i + 2]];
      const sum = threeValues.reduce((total, value) => total + value, 0);
      return [...summedValues, sum];
    },
    [],
  );
  const part2 = countIncreases(summedValues);
  return { part1, part2 };
};

export default solve;

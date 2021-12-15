export interface AOCResult {
  part1: number | string;
  part2: number | string;
}
export type AOCSolver = (input: string, args?: any) => AOCResult;

export const getInput = async (day: number) =>
  await Deno.readTextFile(`./${day.toString().padStart(2, "0")}/input.txt`);

export const getExample = async (day: number) =>
  await Deno.readTextFile(`./${day.toString().padStart(2, "0")}/example.txt`);

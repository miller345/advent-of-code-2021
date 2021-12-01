export interface AOCResult {
  part1: number;
  part2: number;
}
export type AOCSolver = (input: string, args?: any) => AOCResult;

export const getInput = async (day: number) =>
  await Deno.readTextFile(`./${day.toString().padStart(2, "0")}/input.txt`);

export const getExample = async (day: number) =>
  await Deno.readTextFile(`./${day.toString().padStart(2, "0")}/example.txt`);

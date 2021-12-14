import { AOCSolver } from "../aoc.ts";
// import { getExample, getInput } from "../aoc.ts";

type Connection = [string, string];

const parse = (input: string) =>
  input.split("\n").map((line) => line.split("-") as Connection);

const isBig = (cave: string) => cave.toUpperCase() === cave;

const getConnectedCaves = (cave: string, connections: Connection[]): string[] =>
  connections.reduce<string[]>((caves, connection) => {
    const match = connection.findIndex((c) => c === cave);
    if (match === -1) return caves;
    return (match === 0
      ? [...caves, connection[1]]
      : [...caves, connection[0]]);
  }, []);

const getPossiblePaths = (
  connections: Connection[],
): number => {
  let paths: string[][] = [["start"]];
  let count = 0;
  while (paths.length) {
    const currentPath = paths[0];
    const currentCave = currentPath[currentPath.length - 1];
    if (currentCave === "end") {
      paths = paths.slice(1);
      count++;
    } else {
      const possibleCaves = getConnectedCaves(currentCave, connections)
        .filter(
          (cave) => {
            if (isBig(cave)) return true; // can revisit big caves
            if (currentPath.includes(cave)) return false; // dont revisit small caves
            return true;
          },
        );
      const newPaths = possibleCaves.map((cave) => [...currentPath, cave]);
      paths = [...newPaths, ...paths.slice(1)];
    }
  }
  return count;
};

const solve: AOCSolver = (input) => {
  const connections = parse(input);
  const part1 = getPossiblePaths(connections);
  const part2 = 0;
  return { part1, part2 };
};

// console.log(solve(await getExample(12)));
// console.log(solve(await getInput(12)));

export default solve;

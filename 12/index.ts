import { AOCSolver } from "../aoc.ts";

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
  allowDoubleVisit: boolean,
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
      const smallCaves = currentPath.filter((c) => !isBig(c));
      const doubleVisit = smallCaves.length !== new Set(smallCaves).size; // already visited a small cave twice
      const possibleCaves = getConnectedCaves(currentCave, connections)
        .filter(
          (cave) => {
            if (cave === "start") return false; // cant go back to start
            if (isBig(cave)) return true; // can revisit big caves
            if (doubleVisit === true || allowDoubleVisit === false) {
              if (currentPath.includes(cave)) return false; // dont revisit small caves
            }
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
  const part1 = getPossiblePaths(connections, false);
  const part2 = getPossiblePaths(connections, true);
  return { part1, part2 };
};

export default solve;

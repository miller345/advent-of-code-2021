/** get an array with numbers from, to */
export const getRange = (from: number, to: number) => {
  const [low, high] = to > from ? [from, to] : [to, from];
  return [...Array(high - low + 1).keys()].map((i) => i + low);
};

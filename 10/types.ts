const openChars = ["(", "[", "{", "<"] as const;
export type OpenChar = typeof openChars[number];
export function isOpenChar(v: string): v is OpenChar {
  return openChars.includes(v as OpenChar);
}

const closeChars = [")", "]", "}", ">"] as const;
export type CloseChar = typeof closeChars[number];
export function isCloseChar(v: string): v is OpenChar {
  return closeChars.includes(v as CloseChar);
}

export type Char = OpenChar | CloseChar;
export function isChar(v: string): v is Char {
  return isOpenChar(v) || isCloseChar(v);
}

export type Line = Char[];

export interface ParseLineError extends Record<string, unknown> {
  type: "no open chunks" | "wrong close char";
  step: number;
  char: Char;
}
export interface WrongCloseCharError extends ParseLineError {
  type: "wrong close char";
  char: CloseChar;
  expectedChar: CloseChar;
}
export function isWrongCloseCharError(
  e: ParseLineError,
): e is WrongCloseCharError {
  return e.type === "wrong close char";
}

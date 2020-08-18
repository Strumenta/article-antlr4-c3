import {ParseTree} from "antlr4ts/tree";

export type CaretPosition = { line: number, column: number };
export type TokenPosition = { index: number, context: ParseTree, text: string };
export type ComputeTokenPositionFunction = (parseTree: ParseTree, caretPosition: CaretPosition) => TokenPosition;

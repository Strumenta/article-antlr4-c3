import {ParseTree} from "antlr4ts/tree";
import {TokenStream} from "antlr4ts";

export type CaretPosition = { line: number, column: number };
export type TokenPosition = { index: number, context: ParseTree, text: string };
export type ComputeTokenPositionFunction =
    (parseTree: ParseTree, tokens: TokenStream, caretPosition: CaretPosition) => TokenPosition;

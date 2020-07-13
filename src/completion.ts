import {KotlinLexer} from "./parser/KotlinLexer";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinParser} from "./parser/KotlinParser";
import {CodeCompletionCore} from "antlr4-c3";
import {computeTokenIndex} from "./compute-token-index-1";

export function getSuggestions(code: string, caretPosition: { line: number, column: number }) {
    let input = CharStreams.fromString(code);
    let lexer = new KotlinLexer(input);
    let parser = new KotlinParser(new CommonTokenStream(lexer));

    let parseTree = parser.kotlinFile();

    let index = computeTokenIndex(parseTree, caretPosition);
    let core = new CodeCompletionCore(parser);
    let candidates = core.collectCandidates(index);
}

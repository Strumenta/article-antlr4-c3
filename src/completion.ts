import {KotlinLexer} from "./parser/KotlinLexer";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinParser} from "./parser/KotlinParser";
import {CandidatesCollection, CodeCompletionCore, SymbolTable, VariableSymbol} from "antlr4-c3";
import {ParseTree} from "antlr4ts/tree";
import {SymbolTableVisitor} from "./symbol-table-visitor";

export type Position = { line: number, column: number };
export type ComputeTokenIndexFunction = (parseTree: ParseTree, caretPosition: Position) => number;

function suggestVariables(symbolTable: SymbolTable) {
    return symbolTable.getSymbolsOfType(VariableSymbol).map(s => s.name);
}

export function getSuggestions(code: string, caretPosition: Position, computeTokenIndex: ComputeTokenIndexFunction) {
    let input = CharStreams.fromString(code);
    let lexer = new KotlinLexer(input);
    let parser = new KotlinParser(new CommonTokenStream(lexer));

    let parseTree = parser.kotlinFile();

    let index = computeTokenIndex(parseTree, caretPosition);
    let core = new CodeCompletionCore(parser);
    // Luckily, the Kotlin lexer defines all keywords and identifiers after operators,
    // so we can simply exclude the first non-keyword tokens
    let ignored = Array.from(Array(KotlinParser.FILE).keys());
    ignored.push(
        KotlinParser.BinLiteral, KotlinParser.BooleanLiteral, KotlinParser.CharacterLiteral, KotlinParser.DoubleLiteral,
        KotlinParser.HexLiteral, KotlinParser.IntegerLiteral, KotlinParser.LongLiteral, KotlinParser.NullLiteral,
        KotlinParser.RealLiteral);
    ignored.push(KotlinParser.QUOTE_OPEN, KotlinParser.QUOTE_CLOSE, KotlinParser.TRIPLE_QUOTE_OPEN)
    ignored.push(KotlinParser.LabelDefinition, KotlinParser.LabelReference); //We don't handle labels for simplicity
    core.ignoredTokens = new Set(ignored);
    core.preferredRules = new Set([ KotlinParser.RULE_variableRead ]);
    let candidates = core.collectCandidates(index);

    let completions = [];
    if(candidates.rules.has(KotlinParser.RULE_variableRead)) {
        let symbolTable = new SymbolTableVisitor().visit(parseTree);
        completions.push(...suggestVariables(symbolTable));
    }
    candidates.tokens.forEach((_, k) => {
        if(k == KotlinParser.Identifier) {
            //Skip, we’ve already handled it above
        } else if(k == KotlinParser.NOT_IN) {
            completions.push("!in");
        } else if(k == KotlinParser.NOT_IS) {
            completions.push("!is");
        } else {
            completions.push(parser.vocabulary.getDisplayName(k));
        }

    });
    return completions;

}

function suggestIdentifiers(): any[] {
    return [];
}
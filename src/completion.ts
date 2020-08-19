import {KotlinLexer} from "./parser/KotlinLexer";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinParser} from "./parser/KotlinParser";
import {CodeCompletionCore, ScopedSymbol, SymbolTable, VariableSymbol} from "antlr4-c3";
import {ParseTree} from "antlr4ts/tree";
import {SymbolTableVisitor} from "./symbol-table-visitor";
import {Symbol} from "antlr4-c3/out/src/SymbolTable";
import {CaretPosition, ComputeTokenPositionFunction, TokenPosition} from "./types";
import * as fuzzysort from 'fuzzysort';

function getScope(context: ParseTree, symbolTable: SymbolTable) {
    if(!context) {
        return undefined;
    }
    const scope = symbolTable.symbolWithContext(context);
    if(scope) {
        return scope;
    } else {
        return getScope(context.parent, symbolTable);
    }
}

function getAllSymbolsOfType<T extends Symbol>(scope: ScopedSymbol, type: new (...args: any[]) => T): T[] {
    let symbols = scope.getSymbolsOfType(type);
    let parent = scope.parent;
    while(parent && !(parent instanceof ScopedSymbol)) {
        parent = parent.parent;
    }
    if(parent) {
        symbols.push(...getAllSymbolsOfType(parent as ScopedSymbol, type));
    }
    return symbols;
}

function suggestVariables(symbolTable: SymbolTable, position: TokenPosition) {
    const context = position.context;
    const scope = getScope(context, symbolTable);
    let symbols: Symbol[];
    if(scope instanceof ScopedSymbol) { //Local scope
        symbols = getAllSymbolsOfType(scope, VariableSymbol);
    } else { //Global scope
        symbols = symbolTable.getSymbolsOfType(VariableSymbol);
    }
    return filterTokens(position, symbols.map(s => s.name));
}

export function filterTokens_startsWith(position: TokenPosition, candidates: string[]) {
    if(position.text.trim().length == 0) {
        return candidates;
    } else {
        return candidates.filter(c => c.toLowerCase().startsWith(position.text.toLowerCase()));
    }
}

export function filterTokens_fuzzySearch(position: TokenPosition, candidates: string[]) {
    if(position.text.trim().length == 0) {
        return candidates;
    } else {
        return fuzzysort.go(position.text, candidates).map(r => r.target);
    }
}

export let filterTokens = filterTokens_startsWith;
export function setTokenMatcher(fn) {
    filterTokens = fn;
}

export function getSuggestions(
    code: string, caretPosition: CaretPosition, computeTokenPosition: ComputeTokenPositionFunction) {
    let input = CharStreams.fromString(code);
    let lexer = new KotlinLexer(input);
    let parser = new KotlinParser(new CommonTokenStream(lexer));

    let parseTree = parser.kotlinFile();

    let position = computeTokenPosition(parseTree, caretPosition);
    if(!position) {
        return [];
    }
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
    let candidates = core.collectCandidates(position.index);

    let completions = [];
    if(candidates.rules.has(KotlinParser.RULE_variableRead)) {
        let symbolTable = new SymbolTableVisitor().visit(parseTree);
        completions.push(...suggestVariables(symbolTable, position));
    }
    let tokens = [];
    candidates.tokens.forEach((_, k) => {
        if(k == KotlinParser.Identifier) {
            //Skip, we’ve already handled it above
        } else if(k == KotlinParser.NOT_IN) {
            tokens.push("!in");
        } else if(k == KotlinParser.NOT_IS) {
            tokens.push("!is");
        } else {
            tokens.push(parser.vocabulary.getSymbolicName(k).toLowerCase());
        }
    });
    completions.push(...filterTokens(position, tokens));
    return completions;

}

function suggestIdentifiers(): any[] {
    return [];
}
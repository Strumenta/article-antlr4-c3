import {ParseTree, TerminalNode} from "antlr4ts/tree";

export function computeTokenIndex(parseTree: ParseTree, caretPosition: { line: number, column: number }): number {
    if(parseTree instanceof TerminalNode) {
        let start = parseTree.symbol.charPositionInLine;
        let stop = parseTree.symbol.charPositionInLine + parseTree.text.length;
        if(parseTree.symbol.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
            return parseTree.symbol.tokenIndex;
        } else {
            return undefined;
        }
    } else {
        for(let i = 0; i < parseTree.childCount; i++) {
            let index = computeTokenIndex(parseTree.getChild(i), caretPosition);
            if(index !== undefined) {
                return index;
            }
        }

    }
    return undefined;
}
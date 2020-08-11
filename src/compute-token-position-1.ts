import {ParseTree, TerminalNode} from "antlr4ts/tree";

export function computeTokenPosition(parseTree: ParseTree, caretPosition: { line: number, column: number }):
    { index: number, context: ParseTree } {
    if(parseTree instanceof TerminalNode) {
        return computeTokenPositionOfTerminalNode(parseTree, caretPosition);
    } else {
        return computeTokenPositionOfChildNode(parseTree, caretPosition);
    }
}

function computeTokenPositionOfTerminalNode(parseTree: TerminalNode, caretPosition: { line: number; column: number }) {
    let start = parseTree.symbol.charPositionInLine;
    let stop = parseTree.symbol.charPositionInLine + parseTree.text.length;
    if (parseTree.symbol.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
        return { index: parseTree.symbol.tokenIndex, context: parseTree };
    } else {
        return undefined;
    }
}

function computeTokenPositionOfChildNode(parseTree: ParseTree, caretPosition: { line: number; column: number }) {
    for (let i = 0; i < parseTree.childCount; i++) {
        let position = computeTokenPosition(parseTree.getChild(i), caretPosition);
        if (position !== undefined) {
            return position;
        }
    }
    return undefined;
}

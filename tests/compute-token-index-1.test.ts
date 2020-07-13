import {expect} from "chai";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinLexer} from "../src/parser/KotlinLexer";
import {KotlinParser} from "../src/parser/KotlinParser";
import {computeTokenIndex} from "../src/compute-token-index-1";

describe('Token index', function() {
    it("is computed correctly",
        function() {
            const code = `fun test() {
    try {
        doSomething()
    } 
}`;
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let parser = new KotlinParser(new CommonTokenStream(lexer));
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            expect(computeTokenIndex(parseTree, { line: 4, column: 7 })).to.equal(14);
        });
});
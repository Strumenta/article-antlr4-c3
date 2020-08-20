import {expect} from "chai";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinLexer} from "../src/parser/KotlinLexer";
import {KotlinParser} from "../src/parser/KotlinParser";
import {computeTokenPosition as computeTokenPositionSimple} from "../src/compute-token-position-simple";

describe('Token position', function() {
    const code =
`fun test() {
    try {
        doSomething()
    } 
}`;
    it("has the right index",
        function() {
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let parser = new KotlinParser(new CommonTokenStream(lexer));
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPositionSimple(parseTree, { line: 4, column: 7 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(34);
        });
    it("includes partial text match ('fun' keyword)",
        function() {
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let parser = new KotlinParser(new CommonTokenStream(lexer));
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPositionSimple(parseTree, { line: 1, column: 2 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(0);
            expect(tokenPosition.text).to.equal("fu");
        });
    it("includes partial text match (function name)",
        function() {
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let parser = new KotlinParser(new CommonTokenStream(lexer));
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPositionSimple(parseTree, { line: 1, column: 7 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(2);
            expect(tokenPosition.text).to.equal("tes");
        });
});
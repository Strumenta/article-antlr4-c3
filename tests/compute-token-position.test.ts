import {expect} from "chai";
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {KotlinLexer} from "../src/parser/KotlinLexer";
import {KotlinParser} from "../src/parser/KotlinParser";
import {computeTokenPosition} from "../src/compute-token-position";

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
            let tokenStream = new CommonTokenStream(lexer);
            let parser = new KotlinParser(tokenStream);
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPosition(parseTree, tokenStream,{ line: 4, column: 7 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(34);
        });
    it("includes partial text match ('fun' keyword)",
        function() {
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let tokenStream = new CommonTokenStream(lexer);
            let parser = new KotlinParser(tokenStream);
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPosition(parseTree, tokenStream, { line: 1, column: 2 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(0);
            expect(tokenPosition.text).to.equal("fu");
        });
    it("includes partial text match (function name)",
        function() {
            let input = CharStreams.fromString(code);
            let lexer = new KotlinLexer(input);
            let tokenStream = new CommonTokenStream(lexer);
            let parser = new KotlinParser(tokenStream);
            let parseTree = parser.kotlinFile();
            expect(parser.numberOfSyntaxErrors).to.equal(0);
            expect(input.index).to.equal(input.size);
            const tokenPosition = computeTokenPosition(parseTree, tokenStream, { line: 1, column: 7 });
            expect(tokenPosition).to.not.be.undefined;
            expect(tokenPosition.index).to.equal(2);
            expect(tokenPosition.text).to.equal("tes");
        });
        it("is correctly computed even in stream with errors",
            function() {
                    let input = CharStreams.fromString(`fun test() {
    for(i on foo) {
        doSomething()
    } 
}`);
                    let lexer = new KotlinLexer(input);
                    let tokenStream = new CommonTokenStream(lexer);
                    let parser = new KotlinParser(tokenStream);
                    let parseTree = parser.kotlinFile();
                    expect(parser.numberOfSyntaxErrors).to.equal(3);
                    expect(input.index).to.equal(input.size);
                    const tokenPosition = computeTokenPosition(parseTree, tokenStream,{ line: 4, column: 7 });
                    expect(tokenPosition).to.not.be.undefined;
                    expect(tokenPosition.index).to.equal(41);
            });
});
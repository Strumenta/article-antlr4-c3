import {expect} from "chai";

import {computeTokenPosition, getSuggestions, setTokenMatcher, filterTokens, filterTokens_fuzzySearch} from "../src";
import {it} from "mocha";

const localVariablesSuite = function() {
    it("are suggested",
        function() {
            const code =
                `fun test() {
    val v = 1
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 13 }, computeTokenPosition);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("some random name")).to.equal(-1);
        });

    it("are suggested respecting function scope",
        function() {
            const code =
                `fun test1() {
    val k = 'a'
}

fun test2() {
    val v = 1
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 7, column: 13 }, computeTokenPosition);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("k")).to.equal(-1);
        });

    it("are suggested with partial match",
        function() {
            const code =
`fun test() {
    val someVariable = 1
    val anotherVariable = 2
    val z = so
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 14 }, computeTokenPosition);
            expect(suggestions.indexOf("someVariable")).to.not.equal(-1);
            expect(suggestions.indexOf("anotherVariable")).to.equal(-1);
        });
};
describe('Local variables', localVariablesSuite);

describe('Local variables w/fuzzy search', function() {
    let oldMatcher = filterTokens;
    beforeEach(() => setTokenMatcher(filterTokens_fuzzySearch));
    context("Standard local variables tests", localVariablesSuite);
    context("Fuzzy search-specific local variables tests", function () {
        it("are suggested with fuzzy match",
            function() {
                const code =
`fun test() {
    val aVariable = 1
    val anotherOne = 2
    val z = av
}`;
                let suggestions = getSuggestions(code, { line: 4, column: 14 }, computeTokenPosition);
                expect(suggestions.indexOf("aVariable")).to.not.equal(-1);
                expect(suggestions.indexOf("anotherOne")).to.equal(-1);
            });
    });
    afterEach(() => setTokenMatcher(oldMatcher));
});

describe('Global variables', function() {
    it("are suggested in the right-hand side of assignments",
        function() {
            const code =
`val v = 1
fun test() {
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 13 }, computeTokenPosition);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("some random name")).to.equal(-1);
        });
    it("are suggested as function parameters",
        function() {
            const code =
                `val v = 1
fun test() {
    print( )
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 11 }, computeTokenPosition);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("some random name")).to.equal(-1);
        });
});
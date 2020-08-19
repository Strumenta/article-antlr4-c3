import {expect} from "chai";

import {getSuggestions, setTokenMatcher, tokenMatches, tokenMatches_fuzzy} from "../src/completion";
import {computeTokenPosition as computeTokenPosition1} from "../src/compute-token-position-simple";
import {it} from "mocha";

const localVariablesSuite = function() {
    it("are suggested",
        function() {
            const code =
                `fun test() {
    val v = 1
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 13 }, computeTokenPosition1);
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
            let suggestions = getSuggestions(code, { line: 7, column: 13 }, computeTokenPosition1);
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
            let suggestions = getSuggestions(code, { line: 4, column: 14 }, computeTokenPosition1);
            expect(suggestions.indexOf("someVariable")).to.not.equal(-1);
            expect(suggestions.indexOf("anotherVariable")).to.equal(-1);
        });
};
describe('Local variables', localVariablesSuite);

describe('Local variables w/fuzzy search', function() {
    let oldMatcher = tokenMatches;
    beforeEach(() => setTokenMatcher(tokenMatches_fuzzy));
    localVariablesSuite();
    it("are suggested with fuzzy match",
        function() {
            const code =
`fun test() {
    val someVariable = 1
    val anotherVariable = 2
    val z = sv
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 14 }, computeTokenPosition1);
            expect(suggestions.indexOf("someVariable")).to.not.equal(-1);
            expect(suggestions.indexOf("anotherVariable")).to.equal(-1);
        });
    afterEach(() => setTokenMatcher(oldMatcher));
});

describe('Global variables', function() {
    it("are suggested",
        function() {
            const code =
`val v = 1
fun test() {
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 13 }, computeTokenPosition1);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("some random name")).to.equal(-1);
        });
});
import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenPosition as computeTokenPosition1} from "../src/compute-token-position-1";

describe('Local variables', function() {
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
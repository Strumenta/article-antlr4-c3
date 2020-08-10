import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenIndex} from "../src/compute-token-index-1";

describe('Local variables', function() {
    it("are suggested",
        function() {
            const code = `fun test() {
    val v = 1
    val z = 
}`;
            let suggestions = getSuggestions(code, { line: 3, column: 13 }, computeTokenIndex);
            expect(suggestions.indexOf("v")).to.not.equal(-1);
            expect(suggestions.indexOf("some random name")).to.equal(-1);
        });
});
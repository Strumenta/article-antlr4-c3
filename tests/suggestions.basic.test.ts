import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenPosition} from "../src/compute-token-position-1";

describe('Keyword suggestions', function() {
    it("are computed",
        function() {
            const code = `fun test() {
    try {
        doSomething()
    } 
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 7 }, computeTokenPosition);
            expect(suggestions.length).to.equal(51);
        });
});
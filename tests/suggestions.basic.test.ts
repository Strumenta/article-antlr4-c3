import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenPosition} from "../src/compute-token-position-1";

describe('Token index', function() {
    it("is computed correctly",
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
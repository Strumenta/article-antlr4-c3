import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenIndex} from "../src/compute-token-index-1";

describe('Token index', function() {
    it("is computed correctly",
        function() {
            const code = `fun test() {
    try {
        doSomething()
    } 
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 7 }, computeTokenIndex);
            expect(suggestions.length).to.equal(16);
        });
});
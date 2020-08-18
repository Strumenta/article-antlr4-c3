import {expect} from "chai";

import {getSuggestions} from "../src/completion";
import {computeTokenPosition} from "../src/compute-token-position-simple";

describe('Keywords', function() {
    it("are suggested",
        function() {
            const code = `fun test() {
    try {
        doSomething()
    } 
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 7 }, computeTokenPosition);
            expect(suggestions.length).to.equal(51);
        });
    it("are suggested with partial match",
        function() {
            const code = `fun test() {
    try {
        doSomething()
    } ca
}`;
            let suggestions = getSuggestions(code, { line: 4, column: 8 }, computeTokenPosition);
            expect(suggestions.length).to.equal(1);
        });
});
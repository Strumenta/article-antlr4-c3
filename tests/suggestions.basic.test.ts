import {expect} from "chai";

import { computeTokenPosition, getSuggestions, setTokenMatcher, filterTokens, filterTokens_fuzzySearch } from "../src";

const suite = function() {
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
            expect(suggestions.indexOf('catch')).to.be.greaterThan(-1);
        });
};

describe('Keywords', suite);
describe('Keywords w/fuzzy completion', function() {
    let oldMatcher = filterTokens;
    beforeEach(() => setTokenMatcher(filterTokens_fuzzySearch));
    suite();
    afterEach(() => setTokenMatcher(oldMatcher));
});
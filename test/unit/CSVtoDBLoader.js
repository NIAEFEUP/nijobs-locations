import { createSearchIndexTokens } from "../../src/lib/CSVtoDBLoader";
import { LocationConstants } from "../../src/model/Location";

const { minLength } = LocationConstants.searchTerm;

describe("createSearchIndexTokens", () => {

    test("Should return null if given null", () => {
        expect(createSearchIndexTokens(null)).toBe(null);
    });

    test("Should return undefined if given undefined", () => {
        expect(createSearchIndexTokens(undefined)).toBe(undefined);
    });

    test("Should return original string if length less than minimum", () => {

        const string = "a".repeat(minLength - 1);

        expect(createSearchIndexTokens(string)).toEqual(string);
    });

    test("Should create ngrams of given string", () => {

        const string = "a".repeat(minLength + 2);
        const expected =
            `${"a".repeat(minLength)} ${"a".repeat(minLength + 1)} ${"a".repeat(minLength + 2)} "${"a".repeat(minLength + 2)}"`;

        expect(createSearchIndexTokens(string)).toEqual(expected);
    });
});

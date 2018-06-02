"use strict";

const validateIdentifier = require("./validate-identifier");

describe("validate-identifier", () => {
	it("should return true for reserved keyword", () => {
		const l = "while";
		expect(validateIdentifier.isKeyword(l)).toBe(true);
	});

	it("should return false for unreserved keyword", () => {
		const l = "foo";
		expect(validateIdentifier.isKeyword(l)).toBe(false);
	});

	it("should retrun false if literal is not in U+200C zero width non-joiner, U+200D zero width joiner, or any symbol with the Unicode derived core property ID_Continue", () => {
		const l = "\u00A9";
		expect(validateIdentifier.isIdentifierChar(l)).toBe(false);
	});

	it("should retrun true if literal is in U+200C zero width non-joiner, U+200D zero width joiner, or any symbol with the Unicode derived core property ID_Continue", () => {
		const l = "foo$bar";
		expect(validateIdentifier.isIdentifierChar(l)).toBe(true);
	});

	it("should return true if literal name starts with $, _ or any symbol with the unicode derived core property ID_Start", () => {
		const l = "$foo";
		expect(validateIdentifier.isIdentifierStart(l)).toBe(true);
	});

	it("should return false if literal name does not starts with $, _ or any symbol with the unicode derived core property ID_Start", () => {
		const l = "^bar";
		expect(validateIdentifier.isIdentifierStart(l)).toBe(false);
	});
});

"use strict";
const utils = require("../index");

describe("utils", () => {
	describe("createArrowFunction", () => {
		it("should stringify an arrow function", () => {
			expect(utils.createArrowFunction("app.js")).toMatchSnapshot();
		});
	});
	describe("createRegularFunction", () => {
		it("should stringify an regular function", () => {
			expect(utils.createRegularFunction("app.js")).toMatchSnapshot();
		});
	});
	describe("createDynamicPromise", () => {
		it("should stringify an single value", () => {
			expect(utils.createDynamicPromise("app.js")).toMatchSnapshot();
		});
		it("should stringify an array", () => {
			expect(
				utils.createDynamicPromise(["app.js", "index.js"])
			).toMatchSnapshot();
		});
	});
	describe("createAssetFilterFunction", () => {
		it("should stringify an assetFilterFunction", () => {
			expect(utils.createAssetFilterFunction("js")).toMatchSnapshot();
		});
	});
	describe("parseValue", () => {
		it("should parse value", () => {
			expect(utils.parseValue("\t")).toMatchSnapshot();
		});
		it("should parse value with raw value", () => {
			expect(utils.parseValue("hell\u{6F}")).toMatchSnapshot();
		});
	});
	describe("createExternalFunction", () => {
		it("should stringify an ExternalFunction", () => {
			expect(utils.createExternalFunction("js")).toMatchSnapshot();
		});
	});
	describe("createRequire", () => {
		it("should stringify an require statement", () => {
			expect(utils.createRequire("webpack")).toMatchSnapshot();
		});
	});
	describe("Inquirer", () => {
		it("should make an List object", () => {
			expect(utils.List("entry", "does it work?", ["Yes", "Maybe"])).toEqual({
				type: "list",
				name: "entry",
				message: "does it work?",
				choices: ["Yes", "Maybe"]
			});
		});
		it("should make an RawList object", () => {
			expect(
				utils.RawList("output", "does it work?", ["Yes", "Maybe"])
			).toEqual({
				type: "rawlist",
				name: "output",
				message: "does it work?",
				choices: ["Yes", "Maybe"]
			});
		});
		it("should make an CheckList object", () => {
			expect(
				utils.CheckList("context", "does it work?", ["Yes", "Maybe"])
			).toEqual({
				type: "checkbox",
				name: "context",
				message: "does it work?",
				choices: ["Yes", "Maybe"]
			});
		});
		it("should make an Input object", () => {
			expect(utils.Input("plugins", "what is your plugin?")).toEqual({
				type: "input",
				name: "plugins",
				message: "what is your plugin?"
			});
		});
		it("should make an Confirm object", () => {
			expect(utils.Confirm("context", "what is your context?")).toEqual({
				type: "confirm",
				name: "context",
				message: "what is your context?"
			});
		});
		it("should make an Input object with validation", () => {
			expect(
				utils.InputValidate("plugins", "what is your plugin?", () => {})
			).toMatchSnapshot();
		});
	});
});

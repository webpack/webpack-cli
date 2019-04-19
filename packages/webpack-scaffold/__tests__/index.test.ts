"use strict";
import * as utils from "../index";

describe("utils", () => {
	describe("createArrowFunction", () => {
		it("should stringify an arrow function", () => {
			expect(utils.createArrowFunction("app.js")).toMatchSnapshot();
		});
	});
	describe("createRegularFunction", () => {
		it("should stringify a regular function", () => {
			expect(utils.createRegularFunction("app.js")).toMatchSnapshot();
		});
	});
	describe("createDynamicPromise", () => {
		it("should stringify an single value", () => {
			expect(utils.createDynamicPromise("app.js")).toMatchSnapshot();
		});
		it("should stringify an array", () => {
			expect(
				utils.createDynamicPromise(["app.js", "index.js"]),
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
		it("should stringify a require statement", () => {
			expect(utils.createRequire("webpack")).toMatchSnapshot();
		});
	});
	describe("Inquirer", () => {
		it("should make a List object", () => {
			expect(utils.List("entry", "does it work?", ["Yes", "Maybe"])).toEqual({
				choices: ["Yes", "Maybe"],
				message: "does it work?",
				name: "entry",
				type: "list",
			});
		});
		it("should make a RawList object", () => {
			expect(
				utils.RawList("output", "does it work?", ["Yes", "Maybe"]),
			).toEqual({
				choices: ["Yes", "Maybe"],
				message: "does it work?",
				name: "output",
				type: "rawlist",
			});
		});
		it("should make a CheckList object", () => {
			expect(
				utils.CheckList("context", "does it work?", ["Yes", "Maybe"]),
			).toEqual({
				choices: ["Yes", "Maybe"],
				message: "does it work?",
				name: "context",
				type: "checkbox",
			});
		});
		it("should make an Input object", () => {
			expect(utils.Input("plugins", "what is your plugin?")).toEqual({
				default: undefined,
				message: "what is your plugin?",
				name: "plugins",
				type: "input",
			});
		});
		it("should make an Input object", () => {
			expect(utils.Input("plugins", "what is your plugin?", "my-plugin")).toEqual({
				default: "my-plugin",
				message: "what is your plugin?",
				name: "plugins",
				type: "input",
			});
		});
		it("should make a Confirm object", () => {
			expect(utils.Confirm("context", "what is your context?")).toEqual({
				default: true,
				message: "what is your context?",
				name: "context",
				type: "confirm",
			});
		});
		it("should make a Confirm object with No as default", () => {
			expect(utils.Confirm("context", "what is your context?", false)).toEqual({
				default: false,
				message: "what is your context?",
				name: "context",
				type: "confirm",
			});
		});
		it("should make an Input object with validation", () => {
			expect(
				utils.InputValidate("plugins", "what is your plugin?", () => true),
			).toMatchSnapshot();
		});
		it("should make an Input object with validation and default value", () => {
			expect(
				utils.InputValidate("plugins", "what is your plugin?", () => true, "my-plugin"),
			).toMatchSnapshot();
		});
	});
});

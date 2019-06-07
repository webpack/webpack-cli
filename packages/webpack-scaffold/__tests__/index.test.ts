"use strict";
import * as utils from "../index";

describe("utils", () => {
	beforeEach(() => {
		this.mockSelf = {
			prompt: arg => {
				return arg[0];
			}
		};
	});
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
			expect(utils.createDynamicPromise(["app.js", "index.js"])).toMatchSnapshot();
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
		it("should make default value for a List", () => {
			expect(utils.List(this.mockSelf, "entry", "does it work?", ["Yes", "Maybe"], "Yes", true)).toEqual({
				entry: "Yes"
			});
		});
		it("should make a RawList object", () => {
			expect(utils.RawList("output", "does it work?", ["Yes", "Maybe"])).toEqual({
				choices: ["Yes", "Maybe"],
				message: "does it work?",
				name: "output",
				type: "rawlist"
			});
		});
		it("should make a CheckList object", () => {
			expect(utils.CheckList("context", "does it work?", ["Yes", "Maybe"])).toEqual({
				choices: ["Yes", "Maybe"],
				message: "does it work?",
				name: "context",
				type: "checkbox"
			});
		});
		it("should emulate a prompt for list input", () => {
			expect(utils.Input(this.mockSelf, "plugins", "what is your plugin?", "openJSF", false)).toEqual({
				type: "input",
				name: "plugins",
				message: "what is your plugin?",
				default: "openJSF"
			});
		});
		it("should return a default Input object value", () => {
			expect(utils.Input(this.mockSelf, "plugins", "what is your plugin?", "my-plugin", true)).toEqual({
				plugins: "my-plugin"
			});
		});
		it("should emulate a prompt for confirm", () => {
			expect(utils.Confirm(this.mockSelf, "context", "what is your context?", true, false)).toEqual({
				name: "context",
				default: true,
				message: "what is your context?",
				type: "confirm"
			});
		});
		it("should make a Confirm object with yes as default", () => {
			expect(utils.Confirm(this.mockSelf, "context", "what is your context?", true, true)).toEqual({
				context: true
			});
		});
		it("should make an Input object with validation", () => {
			expect(utils.InputValidate(this.mockSelf, "plugins", "what is your plugin?", () => true)).toMatchSnapshot();
		});
		it("should make an Input object with validation and default value", () => {
			expect(
				utils.InputValidate(this.mockSelf, "plugins", "what is your plugin?", () => true, "my-plugin")
			).toMatchSnapshot();
		});
	});
});

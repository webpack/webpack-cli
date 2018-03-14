"use strict";

const j = require("jscodeshift/dist/core");
const utils = require("./ast-utils");

describe("utils", () => {
	describe("createProperty", () => {
		it("should create properties for Boolean", () => {
			const res = utils.createProperty(j, "foo", true);
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it("should create properties for Number", () => {
			const res = utils.createProperty(j, "foo", -1);
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it("should create properties for String", () => {
			const res = utils.createProperty(j, "foo", "bar");
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it("should create properties for complex keys", () => {
			const res = utils.createProperty(j, "foo-bar", "bar");
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it("should create properties for non-literal keys", () => {
			const res = utils.createProperty(j, 1, "bar");
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});
	});

	describe("findPluginsByName", () => {
		it("should find plugins in AST", () => {
			const ast = j(`
{ foo: new webpack.optimize.UglifyJsPlugin() }
`);
			const res = utils.findPluginsByName(j, ast, [
				"webpack.optimize.UglifyJsPlugin"
			]);
			expect(res.size()).toEqual(1);
		});

		it("should find all plugins in AST", () => {
			const ast = j(`
[
	new UglifyJsPlugin(),
	new TestPlugin()
]
`);
			const res = utils.findPluginsByName(j, ast, [
				"UglifyJsPlugin",
				"TestPlugin"
			]);
			expect(res.size()).toEqual(2);
		});

		it("should not find false positives", () => {
			const ast = j(`
{ foo: new UglifyJsPlugin() }
`);
			const res = utils.findPluginsByName(j, ast, [
				"webpack.optimize.UglifyJsPlugin"
			]);
			expect(res.size()).toEqual(0);
		});
	});

	describe("findRootNodesByName", () => {
		it("should find plugins: [] nodes", () => {
			const ast = j(`
const a = { plugins: [], foo: { plugins: [] } }
`);
			const res = utils.findRootNodesByName(j, ast, "plugins");
			expect(res.size()).toEqual(2);
		});

		it("should not find plugins: [] nodes", () => {
			const ast = j(`
const a = { plugs: [] }
`);
			const res = utils.findRootNodesByName(j, ast, "plugins");
			expect(res.size()).toEqual(0);
		});
	});

	describe("createOrUpdatePluginByName", () => {
		it("should create a new plugin without arguments", () => {
			const ast = j("{ plugins: [] }");
			ast.find(j.ArrayExpression).forEach(node => {
				utils.createOrUpdatePluginByName(j, node, "Plugin");
			});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it("should create a new plugin with arguments", () => {
			const ast = j("{ plugins: [] }");
			ast.find(j.ArrayExpression).forEach(node => {
				utils.createOrUpdatePluginByName(j, node, "Plugin", {
					foo: "bar"
				});
			});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it("should add an object as an argument", () => {
			const ast = j("[new Plugin()]");
			ast.find(j.ArrayExpression).forEach(node => {
				utils.createOrUpdatePluginByName(j, node, "Plugin", {
					foo: true
				});
			});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it("should merge options objects", () => {
			const ast = j("[new Plugin({ foo: true })]");
			ast.find(j.ArrayExpression).forEach(node => {
				utils.createOrUpdatePluginByName(j, node, "Plugin", {
					bar: "baz",
					foo: false
				});
				utils.createOrUpdatePluginByName(j, node, "Plugin", {
					"baz-long": true
				});
			});
			expect(ast.toSource()).toMatchSnapshot();
		});
	});

	describe("findVariableToPlugin", () => {
		it("should find the variable name of a plugin", () => {
			const ast = j(`
			const packageName = require('package-name');
			const someOtherconst = somethingElse;
			const otherPackage = require('other-package');
			`);
			const found = utils.findVariableToPlugin(j, ast, "other-package");
			expect(found).toEqual("otherPackage");
		});
	});

	describe("createLiteral", () => {
		it("should create basic literal", () => {
			const literal = utils.createLiteral(j, "stringLiteral");
			expect(j(literal).toSource()).toMatchSnapshot();
		});
		it("should create boolean", () => {
			const literal = utils.createLiteral(j, "true");
			expect(j(literal).toSource()).toMatchSnapshot();
		});
	});

	describe("createIdentifierOrLiteral", () => {
		it("should create basic literal", () => {
			const literal = utils.createIdentifierOrLiteral(j, "'stringLiteral'");
			expect(j(literal).toSource()).toMatchSnapshot();
		});
		it("should create boolean", () => {
			const literal = utils.createIdentifierOrLiteral(j, "true");
			expect(j(literal).toSource()).toMatchSnapshot();
		});
	});

	describe("findObjWithOneOfKeys", () => {
		it("should find keys", () => {
			const ast = j(`
			const ab = {
				a: 1,
				b: 2
			}
			`);
			expect(
				ast
					.find(j.ObjectExpression)
					.filter(p => utils.findObjWithOneOfKeys(p, ["a"]))
					.size()
			).toEqual(1);
		});
	});

	describe("getRequire", () => {
		it("should create a require statement", () => {
			const require = utils.getRequire(j, "filesys", "fs");
			expect(j(require).toSource()).toMatchSnapshot();
		});
	});

	describe("createArrayWithChildren", () => {
		it("should add props to a property", () => {
			const ast = j("{}");
			const arr = utils.createArrayWithChildren(j, ["'bo'"]);
			ast.find(j.Program).forEach(node => j(node).replaceWith(arr));
			expect(ast.toSource()).toMatchSnapshot();
		});
	});
	describe("createEmptyArrayProperty", () => {
		it("should create an array with no properties", () => {
			const ast = j("{}");
			const arr = utils.createEmptyArrayProperty(j, "its-lit");
			ast.find(j.Program).forEach(node => j(node).replaceWith(arr));
			expect(ast.toSource()).toMatchSnapshot();
		});
	});

	describe("createExternalRegExp", () => {
		it("should create an regExp property that has been parsed by jscodeshift", () => {
			const ast = j("{}");
			const reg = j("'\t'");
			const prop = utils.createExternalRegExp(j, reg);
			ast.find(j.Program).forEach(node => j(node).replaceWith(prop));
			expect(ast.toSource()).toMatchSnapshot();
		});
	});
	describe("pushObjectKeys", () => {
		it("should push object to an node using Object.keys", () => {
			const ast = j(`module.exports = {
				pushMe: {}
			}`);
			const webpackProperties = {
				hello: {
					world: {
						its: "'great'"
					}
				}
			};
			ast.find(j.ObjectExpression).forEach(node => {
				utils.pushObjectKeys(j, node, webpackProperties, "pushMe");
			});
			expect(ast.toSource()).toMatchSnapshot();
		});
	});
});

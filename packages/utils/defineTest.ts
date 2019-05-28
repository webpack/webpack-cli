/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as fs from "fs";
import * as path from "path";

import { JSCodeshift, Node } from "./types/NodePath";

interface Module {
	(
		jscodeshift: JSCodeshift,
		ast: Node,
		initOptions: string | boolean | object,
		action: string,
		transformName?: string
	): Node;
	default: transformType;
	parser: string;
}

type transformType = (
	jscodeshift: JSCodeshift,
	ast: Node,
	initOptions: string | boolean | object,
	action: object | string,
	transformName?: string
) => Node;

/**
 * Utility function to run a jscodeshift script within a unit test.
 * This makes several assumptions about the environment.
 *
 * Notes:
 * - The test should be located in a subdirectory next to the transform itself.
 *   Commonly tests are located in a directory called __tests__.
 *
 * - Test data should be located in a directory called __testfixtures__
 *   alongside the transform and __tests__ directory.
 * @param  {String} dirName          contains the name of the directory the test is located in. This
 *                                   should normally be passed via __dirname.
 * @param  {String} transformName    contains the filename of the transform being tested,
 *                                   excluding the .js extension.
 * @param  {String} [testFilePrefix] Optionally contains the name of the file with the test
 *                                   data. If not specified, it defaults to the same value as `transformName`.
 *                                   This will be suffixed with ".input.js" for the input file and ".output.js"
 *                                   for the expected output. For example, if set to "foo", we will read the
 *                                   "foo.input.js" file, pass this to the transform, and expect its output to
 *                                   be equal to the contents of "foo.output.js".
 * @param  {Object|Boolean|String} initOptions TBD
 * @param  {String} action init, update or remove, decides how to format the AST
 * @return {Function} Function that fires of the transforms
 */
function runSingleTransform(
	dirName: string,
	transformName: string,
	testFilePrefix: string,
	initOptions: object | boolean | string,
	action: object | string
): string {
	if (!testFilePrefix) {
		testFilePrefix = transformName;
	}
	const fixtureDir = path.join(dirName, "__tests__", "__testfixtures__");
	const inputPath = path.join(fixtureDir, `${testFilePrefix}.input.js`);
	const source = fs.readFileSync(inputPath, "utf8");

	let module: Module;
	// Assumes transform and test are on the same level
	if (action) {
		module = require(path.join(dirName, "recursive-parser.ts"));
	} else {
		module = require(path.join(dirName, `${transformName}.ts`));
	}
	// Handle ES6 modules using default export for the transform
	const transform = module.default ? module.default : module;

	// Jest resets the module registry after each test, so we need to always get
	// a fresh copy of jscodeshift on every test run.
	// eslint-disable-next-line
	let jscodeshift: JSCodeshift = require("jscodeshift/dist/core");
	if (module.parser) {
		jscodeshift = jscodeshift.withParser(module.parser);
	}
	const ast: Node = jscodeshift(source);
	if (initOptions || typeof initOptions === "boolean") {
		return transform(jscodeshift, ast, initOptions, action, transformName).toSource({
			quote: "single"
		});
	}
	return transform(jscodeshift, ast, source, action).toSource({
		quote: "single"
	});
}

/**
 * Handles some boilerplate around defining a simple jest/Jasmine test for a
 * jscodeshift transform.
 * @param  {String} dirName          contains the name of the directory the test is located in. This
 *                                   should normally be passed via __dirname.
 * @param  {String} transformName    contains the filename of the transform being tested,
 *                                   excluding the .js extension.
 * @param  {String} [testFilePrefix] Optionally contains the name of the file with the test
 *                                   data. If not specified, it defaults to the same value as `transformName`.
 *                                   This will be suffixed with ".input.js" for the input file and ".output.js"
 *                                   for the expected output. For example, if set to "foo", we will read the
 *                                   "foo.input.js" file, pass this to the transform, and expect its output to
 *                                   be equal to the contents of "foo.output.js".
 * @param  {any} transformObject     Object to be transformed with the transformations
 * @param  {String} action init, update or remove, decides how to format the AST
 * @return {Void} Jest makes sure to execute the globally defined functions
 */
export default function defineTest(
	dirName: string,
	transformName: string,
	testFilePrefix?: string,
	transformObject?: object | string,
	action?: object | string
): void {
	const testName: string = testFilePrefix
		? `transforms correctly using "${testFilePrefix}" data`
		: "transforms correctly";
	describe(transformName, () => {
		it(testName, () => {
			const output = runSingleTransform(dirName, transformName, testFilePrefix, transformObject, action);
			expect(output).toMatchSnapshot();
		});
	});
}

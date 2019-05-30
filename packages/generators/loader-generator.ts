import * as _ from "lodash";
import * as path from "path";

import addonGenerator from "./addon-generator";

/**
 * Formats a string into webpack loader format
 * (eg: 'style-loader', 'raw-loader')
 *
 * @param {string} name A loader name to be formatted
 * @returns {string} The formatted string
 */
export function makeLoaderName(name: string): string {
	name = _.kebabCase(name);
	if (!/loader$/.test(name)) {
		name += "-loader";
	}
	return name;
}

/**
 * A yeoman generator class for creating a webpack
 * loader project. It adds some starter loader code
 * and runs `webpack-defaults`.
 *
 * @class LoaderGenerator
 * @extends {Generator}
 */

const LoaderGenerator = addonGenerator(
	[
		{
			default: "my-loader",
			filter: makeLoaderName,
			message: "Loader name",
			name: "name",
			type: "input",
			validate: (str: string): boolean => str.length > 0
		}
	],
	path.resolve(__dirname, "..", "generate-loader"),
	[
		"src/cjs.js.tpl",
		"test/test-utils.js.tpl",
		"test/unit.test.js.tpl",
		"test/functional.test.js.tpl",
		"test/fixtures/simple-file.js.tpl",
		"examples/simple/webpack.config.js.tpl",
		"examples/simple/src/index.js.tpl",
		"examples/simple/src/lazy-module.js.tpl",
		"examples/simple/src/static-esm-module.js.tpl"
	],
	["src/_index.js.tpl"],
	(gen): object => ({ name: gen.props.name })
);

export default LoaderGenerator;

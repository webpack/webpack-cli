import * as _ from "lodash";
import * as path from "path";

import addonGenerator from "./addon-generator";

/**
 * A yeoman generator class for creating a webpack
 * plugin project. It adds some starter plugin code
 * and runs `webpack-defaults`.
 *
 * @class PluginGenerator
 * @extends {Generator}
 */
const PluginGenerator = addonGenerator(
	[
		{
			default: "my-webpack-plugin",
			filter: _.kebabCase,
			message: "Plugin name",
			name: "name",
			type: "input",
			validate: (str: string): boolean => str.length > 0
		}
	],
	path.resolve(__dirname, "..", "generate-plugin"),
	[
		"src/cjs.js.tpl",
		"test/test-utils.js.tpl",
		"test/functional.test.js.tpl",
		"examples/simple/src/index.js.tpl",
		"examples/simple/src/lazy-module.js.tpl",
		"examples/simple/src/static-esm-module.js.tpl"
	],
	["src/_index.js.tpl", "examples/simple/_webpack.config.js.tpl"],
	(gen): object => ({ name: _.upperFirst(_.camelCase(gen.props.name)) })
);

export default PluginGenerator;

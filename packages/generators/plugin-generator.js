const path = require("path");
const _ = require("lodash");
const webpackGenerator = require("./webpack-generator");

/**
 * A yeoman generator class for creating a webpack
 * plugin project. It adds some starter plugin code
 * and runs `webpack-defaults`.
 *
 * @class PluginGenerator
 * @extends {Generator}
 */
const PluginGenerator = webpackGenerator(
	[
		{
			type: "input",
			name: "name",
			message: "Plugin name",
			default: "my-webpack-plugin",
			filter: _.kebabCase,
			validate: str => str.length > 0
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
	[
		"src/_index.js.tpl",
		"examples/simple/_webpack.config.js.tpl"
	],
	gen => ({ name: _.upperFirst(_.camelCase(gen.props.name)) })
);

module.exports = {
	PluginGenerator
};

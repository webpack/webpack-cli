const path = require("path");
const _ = require("lodash");
const webpackGenerator = require("./webpack-generator");

/**
 * Formats a string into webpack loader format
 * (eg: 'style-loader', 'raw-loader')
 *
 * @param {string} name A loader name to be formatted
 * @returns {string} The formatted string
 */
function makeLoaderName(name) {
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
const LoaderGenerator = webpackGenerator(
	[
		{
			type: "input",
			name: "name",
			message: "Loader name",
			default: "my-loader",
			filter: makeLoaderName,
			validate: str => str.length > 0
		}
	],
	path.join(__dirname, "templates"),
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
	gen => ({ name: gen.props.name })
);

module.exports = {
	makeLoaderName,
	LoaderGenerator
};

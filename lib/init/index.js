"use strict";

const yeoman = require("yeoman-environment");
const Generator = require("yeoman-generator");
const path = require("path");
const defaultGenerator = require("../generators/init-generator");
const runTransform = require("./transformations/index");

/**
 *
 * Runs yeoman and runs the transformations based on the object
 * built up from an author/user
 *
 * @param {String} options - An path to the given generator
 * @returns {Function} runTransform - Run transformations based on the finished
 * yeoman instance
 */

function creator(options) {
	let env = yeoman.createEnv("webpack", null);
	const generatorName = options
		? replaceGeneratorName(path.basename(options[0]))
		: "webpack-default-generator";
	if (options) {
		const WebpackGenerator = class extends Generator {
			initializing() {
				options.forEach(path => {
					return this.composeWith(require.resolve(path));
				});
			}
		};
		env.registerStub(WebpackGenerator, generatorName);
	} else {
		env.registerStub(defaultGenerator, "webpack-default-generator");
	}

	env.run(generatorName).on("end", _ => {
		if (generatorName !== "webpack-default-generator") {
			//HACK / FIXME
			env = env.options.env;
			return runTransform(env.configuration);
		} else {
			return runTransform(env.getArgument("configuration"));
		}
	});
}

/*
* @function replaceGeneratorName
*
* Replaces the webpack-addons pattern with the end of the addons name merged
* with 'generator'
*
* @param { String } name - name of the generator
* @returns { String } name - replaced pattern of the name
*/

function replaceGeneratorName(name) {
	return name.replace(/(webpack-addons)?([^:]+)(:.*)?/g, "generator$2");
}

module.exports = {
	creator,
	replaceGeneratorName
};

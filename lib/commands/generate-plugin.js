const yeoman = require("yeoman-environment");
const { PluginGenerator } = require("../generators/plugin-generator");

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */

function pluginCreator() {
	const env = yeoman.createEnv();
	const generatorName = "webpack-plugin-generator";

	env.registerStub(PluginGenerator, generatorName);

	env.run(generatorName);
}

module.exports = pluginCreator;

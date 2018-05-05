const yeoman = require("yeoman-environment");
const PluginGenerator = require("@webpack-cli/generators/plugin-generator").PluginGenerator;

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */
function pluginCreator() {
	const env = yeoman.createEnv();
	const generatorName = "@webpack-cli/plugin";

	env.registerStub(PluginGenerator, generatorName);

	env.run(generatorName);
}

module.exports = pluginCreator;

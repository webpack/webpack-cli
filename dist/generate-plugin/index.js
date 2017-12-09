var yeoman = require("yeoman-environment");
var PluginGenerator = require("../generators/plugin-generator").PluginGenerator;

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */
function pluginCreator() {
	var env = yeoman.createEnv();
	var generatorName = "webpack-plugin-generator";

	env.registerStub(PluginGenerator, generatorName);

	env.run(generatorName);
}

module.exports = pluginCreator;

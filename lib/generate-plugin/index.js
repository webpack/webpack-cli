const yeoman = require('yeoman-environment');
const PluginGenerator = require('./plugin-generator').PluginGenerator;

/**
 * Runs a yeoman generator to create a new webpack plugin project
 */
function pluginCreator() {
	let env = yeoman.createEnv();
	const generatorName = 'webpack-plugin-generator';

	env.registerStub(PluginGenerator, generatorName);

	env.run(generatorName);
}

module.exports = pluginCreator;

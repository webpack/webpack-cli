const yeoman = require('yeoman-environment');
const LoaderGenerator = require('./loader-generator').LoaderGenerator;

/**
 * Runs a yeoman generator to create a new webpack loader project
 */
function loaderCreator() {
	let env = yeoman.createEnv();
	const generatorName = 'webpack-loader-generator';

	env.registerStub(LoaderGenerator, generatorName);

	env.run(generatorName);
}

module.exports = loaderCreator;

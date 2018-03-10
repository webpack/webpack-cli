const yeoman = require("yeoman-environment");
const { LoaderGenerator } = require("../generators/loader-generator");

/**
 * Runs a yeoman generator to create a new webpack loader project
 * @returns {void}
 */
function loaderCreator() {
	const env = yeoman.createEnv();
	const generatorName = "webpack-loader-generator";

	env.registerStub(LoaderGenerator, generatorName);

	env.run(generatorName);
}

module.exports = loaderCreator;

var yeoman = require("yeoman-environment");
var LoaderGenerator = require("../generators/loader-generator").LoaderGenerator;

/**
 * Runs a yeoman generator to create a new webpack loader project
 * @returns {void}
 */
function loaderCreator() {
	var env = yeoman.createEnv();
	var generatorName = "webpack-loader-generator";

	env.registerStub(LoaderGenerator, generatorName);

	env.run(generatorName);
}

module.exports = loaderCreator;

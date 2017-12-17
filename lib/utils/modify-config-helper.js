"use strict";

const fs = require("fs");
const path = require("path");
const yeoman = require("yeoman-environment");
const runTransform = require("../init/transformations/index");

module.exports = function(action, generator) {
	const configPath = path.resolve(process.cwd(), "webpack.config.js");
	const webpackConfigExists = fs.existsSync(configPath);
	if (!webpackConfigExists) {
		throw new Error(
			"Couldn't find a webpack configuration in your project path"
		);
	}
	const env = yeoman.createEnv("webpack", null);
	const generatorName = `webpack-${action}-generator`;
	env.registerStub(generator, generatorName);

	env.run(generatorName).on("end", () => {
		const config = Object.assign(
			{
				configFile: fs.readFileSync(configPath, "utf8"),
				configPath: configPath
			},
			env.getArgument("configuration")
		);
		return runTransform(config, action);
	});
};

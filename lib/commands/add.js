"use strict";

const fs = require("fs");
const path = require("path");
const yeoman = require("yeoman-environment");
const defaultGenerator = require("../generators/add-generator");
const runTransform = require("../init/transformations/index");

module.exports = function() {
	const configPath = path.resolve(process.cwd(), "webpack.config.js");
	const webpackConfigExists = fs.existsSync(configPath);
	if (!webpackConfigExists) {
		throw new Error(
			"Couldn't find a webpack configuration in your project path"
		);
	}
	const env = yeoman.createEnv("webpack", null);
	const generatorName = "webpack-add-generator";
	env.registerStub(defaultGenerator, generatorName);

	env.run(generatorName).on("end", () => {
		const config = Object.assign(
			{
				configFile: fs.readFileSync(configPath, "utf8"),
				configPath: configPath
			},
			env.getArgument("configuration")
		);
		return runTransform(config, "add");
	});
};

"use strict";

const prettier = require("prettier");
const fs = require("fs");
const chalk = require("chalk");

/*
*
* Runs prettier and later prints the output configuration
*
* @param { String } outputPath - Path to write the config to
* @param { Node } source - AST to write at the given path
* @returns fs - Writes a file at given location and prints messages accordingly
*/

module.exports = function runPrettier(outputPath, source) {
	function validateConfig() {
		let prettySource;
		try {
			prettySource = prettier.format(source, {
				singleQuote: true,
				useTabs: true,
				tabWidth: 1
			});
		} catch (err) {
			process.stdout.write(
				"\n" +
					chalk.yellow(
						`WARNING: Could not apply prettier to ${outputPath}` +
							" due validation error, but the file has been created\n"
					)
			);
			prettySource = source;
		}
		return fs.writeFileSync(outputPath, prettySource, "utf8");
	}
	return fs.writeFile(outputPath, source, "utf8", validateConfig);
};

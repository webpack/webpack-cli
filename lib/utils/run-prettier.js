"use strict";

const prettier = require("prettier");
const fs = require("fs");
const chalk = require("chalk");

/**
 *
 * Runs prettier and later prints the output configuration
 *
 * @param {String} outputPath - Path to write the config to
 * @param {Node} source - AST to write at the given path
 * @param {Function} cb - executes a callback after execution if supplied
 * @returns {Function} Writes a file at given location and prints messages accordingly
 */

module.exports = function runPrettier(outputPath, source, cb) {
	function validateConfig() {
		let prettySource;
		let error;
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
			error = err;
		}
		if (cb) {
			return cb(error);
		}
		return fs.writeFileSync(outputPath, prettySource, "utf8");
	}
	return fs.writeFile(outputPath, source, "utf8", validateConfig);
};

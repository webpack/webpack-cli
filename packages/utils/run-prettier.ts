import chalk from "chalk";
import * as fs from "fs";
import * as prettier from "prettier";

/**
 *
 * Runs prettier and later prints the output configuration
 *
 * @param {String} outputPath - Path to write the config to
 * @param {Node} source - AST to write at the given path
 * @param {Function} cb - executes a callback after execution if supplied
 * @returns {Void} Writes a file at given location and prints messages accordingly
 */

export default function runPrettier(outputPath: string, source: string, cb?: Function): void {
	function validateConfig(): void | Function {
		let prettySource: string;
		let error: object;
		try {
			prettySource = prettier.format(source, {
				filepath: outputPath,
				parser: "babel",
				singleQuote: true,
				tabWidth: 1,
				useTabs: true
			});
		} catch (err) {
			process.stdout.write(
				`\n${chalk.yellow(
					`WARNING: Could not apply prettier to ${outputPath}` +
						" due validation error, but the file has been created\n"
				)}`
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
}

import chalk from "chalk";
import * as j from "jscodeshift";
import pEachSeries = require("p-each-series");
import * as path from "path";
import { getPackageManager } from "./package-manager";

import { findProjectRoot } from "./path-utils";

import { Error } from "./types";
import { Config, TransformConfig } from "./types";
import propTypes from "./prop-types";
import astTransform from "./recursive-parser";
import runPrettier from "./run-prettier";
import { Node } from "./types/NodePath";

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with keys on which transformations need to be run
 */

function mapOptionsToTransform(config: Config): string[] {
	return Object.keys(config.webpackOptions).filter((k: string): boolean => propTypes.has(k));
}

/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} transformConfig 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */

export default function runTransform(transformConfig: TransformConfig, action: string): void {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig = Object.keys(transformConfig).filter((p: string): boolean => {
		return p !== "configFile" && p !== "configPath";
	});
	const initActionNotDefined = action && action !== "init" ? true : false;

	webpackConfig.forEach(
		(scaffoldPiece: string): Promise<void> => {
			const config: Config = transformConfig[scaffoldPiece];

			const transformations = mapOptionsToTransform(config);

			if (config.topScope && transformations.indexOf("topScope") === -1) {
				transformations.push("topScope");
			}

			if (config.merge && transformations.indexOf("merge") === -1) {
				transformations.push("merge");
			}

			const ast: Node = j(initActionNotDefined ? transformConfig.configFile : "module.exports = {}");

			const transformAction: string = action || null;

			return pEachSeries(transformations, (f: string): boolean | Node => {
				if (f === "merge" || f === "topScope") {
					// TODO: typing here is difficult to understand
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return astTransform(j, ast, f, config[f] as any, transformAction);
				}
				return astTransform(j, ast, f, config.webpackOptions[f], transformAction);
			})
				.then((): void | PromiseLike<void> => {
					let configurationName: string;
					if (!config.configName) {
						configurationName = "webpack.config.js";
					} else {
						configurationName = "webpack." + config.configName + ".js";
					}
					const projectRoot = findProjectRoot();
					const outputPath: string = initActionNotDefined
						? transformConfig.configPath
						: path.join(projectRoot || process.cwd(), configurationName);
					const source: string = ast.toSource({
						quote: "single"
					});
					runPrettier(outputPath, source);
				})
				.catch((err: Error): void => {
					console.error(err.message ? err.message : err);
				});
		}
	);

	const runCommand = getPackageManager() === "yarn" ? "yarn build" : "npm run build";

	let successMessage: string =
		chalk.green(`Congratulations! Your new webpack configuration file has been created!\n\n`) +
		`You can now run ${chalk.green(runCommand)} to bundle your application!\n\n`;

	if (initActionNotDefined && transformConfig.config.item) {
		successMessage = chalk.green(`Congratulations! ${transformConfig.config.item} has been ${action}ed!\n`);
	}
	process.stdout.write(`\n${successMessage}`);
}

import chalk from "chalk";
import * as j from "jscodeshift";
import pEachSeries = require("p-each-series");
import * as path from "path";

import propTypes from "@webpack-cli/utils/prop-types";
import astTransform from "@webpack-cli/utils/recursive-parser";
import runPrettier from "@webpack-cli/utils/run-prettier";

import { Node } from "./types/NodePath";
import { Error } from "./types";
import { Configuration, WebpackProperties } from "./types/Transform";

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} transformObject 	- An Object with all transformations
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with the transformations to be run
 */

const mapOptionsToTransform = (config: Configuration): string[] =>
	Object.keys(config.webpackOptions).filter((key: string): boolean => propTypes.has(key));

/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} webpackProperties 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */

export default function runTransform(webpackProperties: WebpackProperties, action: string): void {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig: string[] = Object.keys(webpackProperties).filter(
		(p: string): boolean => p !== "configFile" && p !== "configPath"
	);

	const initActionNotDefined = (action && action !== "init") || false;

	webpackConfig.forEach(
		(scaffoldPiece: string): Promise<void> => {
			const config: Configuration = webpackProperties[scaffoldPiece];
			const transformations = mapOptionsToTransform(config);
			const ast = j(initActionNotDefined ? webpackProperties.configFile : "module.exports = {}");
			const transformAction: string | null = action || null;

			return pEachSeries(transformations, (f: string): boolean | Node => {
				return astTransform(j, ast, config.webpackOptions[f], transformAction, f);
			})
				.then((): void | PromiseLike<void> => {
					let configurationName = "webpack.config.js";
					if (config.configName) {
						configurationName = `webpack.${config.configName}.js`;
					}

					const outputPath = initActionNotDefined
						? webpackProperties.configPath
						: path.join(process.cwd(), configurationName);

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

	let successMessage = `Congratulations! Your new webpack configuration file has been created!`;
	if (initActionNotDefined && webpackProperties.config.item) {
		successMessage = `Congratulations! ${webpackProperties.config.item} has been ${action}ed!`;
	}
	process.stdout.write("\n" + chalk.green(`${successMessage}\n`));
}

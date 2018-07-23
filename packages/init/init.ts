import chalk from "chalk";
import * as j from "jscodeshift";
import pEachSeries = require("p-each-series");
import * as path from "path";

import propTypes from "@webpack-cli/utils/prop-types";
import astTransform from "@webpack-cli/utils/recursive-parser";
import runPrettier from "@webpack-cli/utils/run-prettier";

import { INode } from "@webpack-cli/utils/types/NodePath";
import { IError } from "./types";
import { IConfiguration, IWebpackProperties } from "./types/Transform";

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} transformObject 	- An Object with all transformations
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with the transformations to be run
 */

const mapOptionsToTransform = (config: IConfiguration): string[] =>
	Object.keys(config.webpackOptions)
		.filter((key: string): boolean => propTypes.has(key));

/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} webpackProperties 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */

export default function runTransform(webpackProperties: IWebpackProperties, action: string): void {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig: string[] =
		Object
			.keys(webpackProperties)
			.filter((p: string): boolean => p !== "configFile" && p !== "configPath");

	const initActionNotDefined: boolean = (action && action !== "init") || false;

	webpackConfig.forEach((scaffoldPiece: string): Promise<void> => {
		const config: IConfiguration = webpackProperties[scaffoldPiece];
		const transformations: string[] = mapOptionsToTransform(config);
		const ast = j(
			initActionNotDefined
				? webpackProperties.configFile
				: "module.exports = {}",
		);
		const transformAction: string | null = action || null;

		return pEachSeries(transformations, (f: string): boolean | INode => {
			return astTransform(j, ast, config.webpackOptions[f], transformAction, f);
		})
			.then((value: string[]): void | PromiseLike <void> => {
				let configurationName: string = "webpack.config.js";
				if (config.configName) {
					configurationName = "webpack." + config.configName + ".js";
				}

				const outputPath: string = initActionNotDefined
					? webpackProperties.configPath
					: path.join(process.cwd(), configurationName);

				const source: string = ast.toSource({
					quote: "single",
				});

				runPrettier(outputPath, source);
			})
			.catch((err: IError) => {
				console.error(err.message ? err.message : err);
			});
	});

	if (initActionNotDefined && webpackProperties.config.item) {
		process.stdout.write(
			"\n" +
				chalk.green(
					`Congratulations! ${
						webpackProperties.config.item
					} has been ${action}ed!\n`,
				),
		);
	} else {
		process.stdout.write(
			"\n" +
				chalk.green(
					"Congratulations! Your new webpack configuration file has been created!\n",
				),
		);
	}
}

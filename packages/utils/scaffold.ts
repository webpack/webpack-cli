import chalk from "chalk";
import * as j from "jscodeshift";
import pEachSeries = require("p-each-series");
import * as path from "path";
import { findProjectRoot } from "./find-root";

import { IError } from "../init/types";
import { IConfig, ITransformConfig } from "./modify-config-helper";
import propTypes from "./prop-types";
import astTransform from "./recursive-parser";
import runPrettier from "./run-prettier";
import { INode } from "./types/NodePath";

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with keys on which transformations need to be run
 */

function mapOptionsToTransform(config: IConfig): string[] {
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

export default function runTransform(transformConfig: ITransformConfig, action: string): void {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig = Object.keys(transformConfig).filter((p: string): boolean => {
		return p !== "configFile" && p !== "configPath";
	});
	const initActionNotDefined = action && action !== "init" ? true : false;

	webpackConfig.forEach((scaffoldPiece: string) => {
		const config: IConfig = transformConfig[scaffoldPiece];

		const transformations = mapOptionsToTransform(config);

		if (config.topScope && transformations.indexOf("topScope") === -1) {
			transformations.push("topScope");
		}

		if (config.merge) {
			transformations.push("merge");
		}

		const ast: INode = j(
			initActionNotDefined
				? transformConfig.configFile
				: "module.exports = {}",
		);

		const transformAction: string = action || null;

		return pEachSeries(transformations, (f: string): boolean | INode => {
			if (f === "merge" || f === "topScope") {
				return astTransform(j, ast, f, config[f], transformAction);
			}
			return astTransform(j, ast, f, config.webpackOptions[f], transformAction);
		})
			.then((value: string[]): void | PromiseLike <void> => {
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
					quote: "single",
				});
				runPrettier(outputPath, source);

			})
			.catch((err: IError) => {
				console.error(err.message ? err.message : err);
			});
	});
	let successMessage : string = `Congratulations! Your new webpack configuration file has been created!\n`
	if (initActionNotDefined && transformConfig.config.item) {
		successMessage = `Congratulations! ${
			transformConfig.config.item
		} has been ${action}ed!\n`
	}
	process.stdout.write(
		"\n" +
			chalk.green(
				successMessage
			)
	);
}

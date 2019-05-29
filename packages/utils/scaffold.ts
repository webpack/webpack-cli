import chalk from "chalk";
import * as j from "jscodeshift";
import pEachSeries = require("p-each-series");
import * as path from "path";
import { findProjectRoot } from "./find-root";

import { Error } from "../init/types";
import { Config, TransformConfig } from "./modify-config-helper";
import propTypes from "./prop-types";
import astTransform from "./recursive-parser";
import runPrettier from "./run-prettier";
import { Node } from "./types/NodePath";



function mergeHandler(config: Config, transformations: string[]): [Config, string[]]{
	if(transformations.indexOf("topScope") === -1)
	{
		config["topScope"] = [
			`const merge = require('webpack-merge')`,
			`const ${config.merge[0]} = require(${config.merge[1]})`
		];
	} else {
		config.topScope.push(
			`const merge = require('webpack-merge')`,
			`const ${config.merge[0]} = require(${config.merge[1]})`
		)
	}

	config.merge = config.merge[0];
	transformations.push("merge", "topScope");
	return [config, transformations]
}


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
	const webpackConfig = Object.keys(transformConfig).filter(
		(p: string): boolean => {
			return p !== "configFile" && p !== "configPath";
		}
	);
	const initActionNotDefined = action && action !== "init" ? true : false;

	webpackConfig.forEach(
		(scaffoldPiece: string): Promise<void> => {
			let config: Config = transformConfig[scaffoldPiece];

			let transformations = mapOptionsToTransform(config);

			if (config.topScope && transformations.indexOf("topScope") === -1) {
				transformations.push("topScope");
			}

			if (config.merge && transformations.indexOf("merge") === -1) {
				[config, transformations] = mergeHandler(config, transformations);
			}

			const ast: Node = j(initActionNotDefined ? transformConfig.configFile : "module.exports = {}");

			const transformAction: string = action || null;

			return pEachSeries(
				transformations,
				(f: string): boolean | Node => {
					if (f === "merge" || f === "topScope") {
						// TODO: typing here is difficult to understand
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						return astTransform(j, ast, f, config[f] as any, transformAction);
					}
					return astTransform(j, ast, f, config.webpackOptions[f], transformAction);
				}
			)
				.then(
					(): void | PromiseLike<void> => {
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
					}
				)
				.catch(
					(err: Error): void => {
						console.error(err.message ? err.message : err);
					}
				);
		}
	);
	let successMessage: string = `Congratulations! Your new webpack configuration file has been created!\n`;
	if (initActionNotDefined && transformConfig.config.item) {
		successMessage = `Congratulations! ${transformConfig.config.item} has been ${action}ed!\n`;
	}
	process.stdout.write("\n" + chalk.green(successMessage));
}

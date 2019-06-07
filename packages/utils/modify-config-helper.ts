import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as yeoman from "yeoman-environment";
import * as Generator from "yeoman-generator";

import { TransformConfig } from "./types/Config";
import runTransform from "./scaffold";

export interface Config extends Object {
	item?: {
		name: string;
	};
	topScope?: string[];
	configName?: string;
	merge: string | string[];
	webpackOptions: object;
}

export interface TransformConfig extends Object {
	configPath?: string;
	configFile?: string;
	config?: Config;
}

const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

/**
 *
 * Looks up the webpack.config in the user's path and runs a given
 * generator scaffold followed up by a transform
 *
 * @param {String} action — action to be done (add, remove, update, init)
 * @param {Class} generator - Yeoman generator class
 * @param {String} configFile - Name of the existing/default webpack configuration file
 * @param {Array} packages - List of packages to resolve
 * @returns {Function} runTransform - Returns a transformation instance
 */

export default function modifyHelperUtil(
	action: string,
	generator: typeof Generator,
	configFile: string = DEFAULT_WEBPACK_CONFIG_FILENAME,
	packages?: string[],
	autoSetDefaults: boolean = false
): any {
	let configPath: string | null = null;

	const env = yeoman.createEnv("webpack", null);
	const generatorName = "webpack-init-generator";

	if (!generator) {
		generator = class extends Generator {
			public initializing(): void {
				packages.forEach(
					(pkgPath: string): Generator => {
						return this.composeWith(require.resolve(pkgPath), {});
					}
				);
			}
		};
	}

	env.registerStub(generator, generatorName);
	env.run(generatorName, {
		configFile,
		autoSetDefaults
	})
		.then((): void => {
			let configModule: object;
			try {
				const confPath = path.resolve(process.cwd(), ".yo-rc.json");
				configModule = require(confPath);
				// Change structure of the config to be transformed
				const tmpConfig: object = {};
				Object.keys(configModule).forEach((prop: string): void => {
					const configs = Object.keys(configModule[prop].configuration);
					configs.forEach((conf: string): void => {
						tmpConfig[conf] = configModule[prop].configuration[conf];
					});
				});
				configModule = tmpConfig;
			} catch (err) {
				console.error(chalk.red("\nCould not find a yeoman configuration file.\n"));
				console.error(
					chalk.red(
						"\nPlease make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.\n"
					)
				);
				Error.stackTraceLimit = 0;
				process.exitCode = -1;
			}
			const transformConfig: TransformConfig = Object.assign(
				{
					configFile: !configPath ? null : fs.readFileSync(configPath, "utf8"),
					configPath
				},
				configModule
			);
			return runTransform(transformConfig, "init");
		})
		.catch((err): void => {
			console.error(
				chalk.red(
					`
Unexpected Error
please file an issue here https://github.com/webpack/webpack-cli/issues/new?template=Bug_report.md
				`
				)
			);
			console.error(err);
		});
}

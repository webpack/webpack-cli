import chalk from "chalk";
import * as fs from "fs";
import * as logSymbols from "log-symbols";
import * as path from "path";
import * as yeoman from "yeoman-environment";
import * as Generator from "yeoman-generator";


import runTransform from "./scaffold";
import Questioner from "./questioner";

export interface Config extends Object {
	item?: {
		name: string;
	};
	topScope?: string[];
	configName?: string;
	merge: object;
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
	mode: string = "CLI",
)
	: Function {

	let configPath: string | null = null;
	const usingCLI: boolean = mode === "CLI";

	if (action !== "init") {
		configPath = path.resolve(process.cwd(), configFile);
		const webpackConfigExists: boolean = fs.existsSync(configPath);
		// Check not required for UI
		if (webpackConfigExists) {
			if (usingCLI) {
				process.stdout.write(
					"\n" +
						logSymbols.success +
						chalk.green(" SUCCESS ") +
						"Found config " +
						chalk.cyan(configFile + "\n") +
						"\n",
				);
			}
		} else {
			if (usingCLI) {
				process.stdout.write(
					"\n" +
						logSymbols.error +
						chalk.red(" ERROR ") +
						chalk.cyan(configFile) +
						" not found. Please specify a valid path to your webpack config like " +
						chalk.white("$ ") +
						chalk.cyan(`webpack-cli ${action} webpack.dev.js`) +
						"\n",
				);
				return;
			}
		}
	}

	const env = yeoman.createEnv("webpack", null);
	const generatorName = `webpack-${action}-generator`;

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

	if (!usingCLI) {
		const questioner = new Questioner();
		generator.prototype.prompt = questioner.question;
	}
	env.registerStub(generator, generatorName);

	env.run(generatorName).then(() => {
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
			if (usingCLI) {
				console.error(
					chalk.red("\nCould not find a yeoman configuration file.\n"),
				);
				console.error(
					chalk.red(
						"\nPlease make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.\n",
					),
				);
				Error.stackTraceLimit = 0;
				process.exitCode = -1;
			} else {
				return false;
			}
		}
		const transformConfig: TransformConfig = Object.assign(
			{
				configFile: !configPath ? null : fs.readFileSync(configPath, "utf8"),
				configPath,
			},
			configModule,
		);

		runTransform(transformConfig, action);
		if (usingCLI) {
			const initActionNotDefined: boolean = action && action !== "init" ? true : false;
			if (initActionNotDefined && transformConfig.config.item) {
				process.stdout.write(
					"\n" +
						chalk.green(
							`Congratulations! ${
								transformConfig.config.item
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
			return;
		}
		return true;
	}).catch((err) => {
		if (usingCLI) {
			console.error(
				chalk.red(
					`
Unexpected Error
please file an issue here https://github.com/webpack/webpack-cli/issues/new?template=Bug_report.md
					`,
				),
			);
			console.error(err);
		}
		return false;
	});
}

import chalk from "chalk";
import diff from "diff";
import fs from "fs";
import inquirer from "inquirer";
import Listr from "listr";
import pLazy = require("p-lazy");
import path from "path";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { validate, WebpackOptionsValidationError } from "webpack";
import { runPrettier } from "@webpack-cli/utils";
import { transformations } from "./migrate";
import { Node } from "./types/NodePath";
import jscodeshift from "jscodeshift";

declare let process: {
	cwd: Function;
	webpackModule: {
		validate: Function;
		WebpackOptionsValidationError: {
			new: (
				errors: string[]
			) => {
				message: string;
			};
		};
	};
	stdout: {
		write: Function;
	};
	exitCode: number;
};

/**
 *
 * Runs migration on a given configuration using AST's and promises
 * to sequentially transform a configuration file.
 *
 * @param {String} currentConfigPath - input path for config
 * @param {String} outputConfigPath - output path for config
 * @returns {Promise} Runs the migration using a promise that
 * will throw any errors during each transform or output if the
 * user decides to abort the migration
 */

function runMigration(currentConfigPath: string, outputConfigPath: string): Promise<void> | void {
	const recastOptions: object = {
		quote: "single"
	};

	const tasks: Listr = new Listr([
		{
			task: (ctx: Node): string | void | Listr | Promise<{}> =>
				new pLazy(
					(
						resolve: (value?: object) => void,
						reject: (reason?: string | object, err?: object) => void
					): void => {
						fs.readFile(currentConfigPath, "utf8", (err: object, content: string): void => {
							if (err) {
								reject(err);
							}
							try {
								ctx.source = content;
								ctx.ast = jscodeshift(content);
								resolve();
							} catch (err) {
								reject("Error generating AST", err);
							}
						});
					}
				),
			title: "Reading webpack config"
		},
		{
			task: (ctx: Node): string | void | Listr | Promise<{}> => {
				return new Listr(
					Object.keys(transformations).map((key: string): {
						task: () => string;
						title: string;
					} => {
						const transform: Function = transformations[key];
						return {
							task: (): string => transform(ctx.ast, ctx.source),
							title: key
						};
					})
				);
			},
			title: "Migrating config to newest version"
		}
	]);

	tasks
		.run()
		.then((ctx: Node): void | Promise<void> => {
			const result: string = ctx.ast.toSource(recastOptions);
			const diffOutput: diff.Change[] = diff.diffLines(ctx.source, result);

			diffOutput.forEach((diffLine: diff.Change): void => {
				if (diffLine.added) {
					process.stdout.write(chalk.green(`+ ${diffLine.value}`));
				} else if (diffLine.removed) {
					process.stdout.write(chalk.red(`- ${diffLine.value}`));
				}
			});

			return inquirer
				.prompt([
					{
						default: "Y",
						message: "Are you sure these changes are fine?",
						name: "confirmMigration",
						type: "confirm"
					}
				])
				.then(
					(answers: { confirmMigration: boolean }): Promise<{}> => {
						if (answers.confirmMigration) {
							return inquirer.prompt([
								{
									default: "Y",
									message:
										"Do you want to validate your configuration? " +
										"(If you're using webpack merge, validation isn't useful)",
									name: "confirmValidation",
									type: "confirm"
								}
							]);
						} else {
							console.error(chalk.red("✖ Migration aborted"));
						}
					}
				)
				.then(async(answer: { confirmValidation: boolean }): Promise<void> => {
					if (!answer) {
						return;
					}

					runPrettier(outputConfigPath, result, (err: object): void => {
						if (err) {
							throw err;
						}
					});

					if (answer.confirmValidation) {
						const outputPath = await import(outputConfigPath);
						const webpackOptionsValidationErrors: string[] = validate(outputPath);

						if (webpackOptionsValidationErrors.length) {
							console.error(chalk.red("\n✖ Your configuration validation wasn't successful \n"));
							console.error(new WebpackOptionsValidationError(webpackOptionsValidationErrors).message);
						}
					}

					console.info(chalk.green(`\n✔︎ New webpack config file is at ${outputConfigPath}.`));
					console.info(
						chalk.green("✔︎ Heads up! Updating to the latest version could contain breaking changes.")
					);

					console.info(chalk.green("✔︎ Plugin and loader dependencies may need to be updated."));
				});
		})
		.catch((err: object): void => {
			const errMsg = "\n ✖ ︎Migration aborted due to some errors: \n";
			console.error(chalk.red(errMsg));
			console.error(err);
			process.exitCode = 1;
		});
}

/**
 *
 * Runs migration on a given configuration using AST's and promises
 * to sequentially transform a configuration file.
 *
 * @param {Array} args - Migrate arguments such as input and
 * output path
 * @returns {Function} Runs the migration using the 'runMigrate'
 * function.
 */

export default function migrate(...args: string[]): void | Promise<void> {
	const filePaths = args;
	if (!filePaths.length) {
		const errMsg = "\n ✖ Please specify a path to your webpack config \n ";
		console.error(chalk.red(errMsg));
		return;
	}

	const currentConfigPath = path.resolve(process.cwd(), filePaths[0]);
	let outputConfigPath: string;

	if (!filePaths[1]) {
		return inquirer
			.prompt([
				{
					default: "Y",
					message:
						"Migration output path not specified. " +
						"Do you want to use your existing webpack " +
						"configuration?",
					name: "confirmPath",
					type: "confirm"
				}
			])
			.then((ans: { confirmPath: boolean }): void | Promise<void> => {
				if (!ans.confirmPath) {
					console.error(chalk.red("✖ ︎Migration aborted due no output path"));
					return;
				}
				outputConfigPath = path.resolve(process.cwd(), filePaths[0]);
				return runMigration(currentConfigPath, outputConfigPath);
			})
			.catch((err: object): void => {
				console.error(err);
			});
	}
	outputConfigPath = path.resolve(process.cwd(), filePaths[1]);
	return runMigration(currentConfigPath, outputConfigPath);
}

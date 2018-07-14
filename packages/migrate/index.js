"use strict";

const fs = require("fs");
const path = require("path");
const color = require("turbocolor");
const diff = require("diff");
const inquirer = require("inquirer");
const PLazy = require("p-lazy");
const Listr = require("listr");

const { validate } = process.webpackModule;
const { WebpackOptionsValidationError } = process.webpackModule;

const runPrettier = require("@webpack-cli/utils/run-prettier");

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

module.exports = function migrate(...args) {
	const filePaths = args.slice(3);
	if (!filePaths.length) {
		const errMsg = "\n ✖ Please specify a path to your webpack config \n ";
		console.error(color.red(errMsg));
		return;
	}
	const currentConfigPath = path.resolve(process.cwd(), filePaths[0]);
	let outputConfigPath;
	if (!filePaths[1]) {
		return inquirer
			.prompt([
				{
					type: "confirm",
					name: "confirmPath",
					message:
						"Migration output path not specified. " +
						"Do you want to use your existing webpack " +
						"configuration?",
					default: "Y"
				}
			])
			.then(ans => {
				if (!ans["confirmPath"]) {
					console.error(color.red("✖ ︎Migration aborted due no output path"));
					return;
				}
				outputConfigPath = path.resolve(process.cwd(), filePaths[0]);
				return runMigration(currentConfigPath, outputConfigPath);
			})
			.catch(err => {
				console.error(err);
			});
	}
	outputConfigPath = path.resolve(process.cwd(), filePaths[1]);
	return runMigration(currentConfigPath, outputConfigPath);
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

function runMigration(currentConfigPath, outputConfigPath) {
	const recastOptions = {
		quote: "single"
	};
	const tasks = new Listr([
		{
			title: "Reading webpack config",
			task: ctx =>
				new PLazy((resolve, reject) => {
					fs.readFile(currentConfigPath, "utf8", (err, content) => {
						if (err) {
							reject(err);
						}
						try {
							const jscodeshift = require("jscodeshift");
							ctx.source = content;
							ctx.ast = jscodeshift(content);
							resolve();
						} catch (err) {
							reject("Error generating AST", err);
						}
					});
				})
		},
		{
			title: "Migrating config to newest version",
			task: ctx => {
				const transformations = require("./migrate").transformations;
				return new Listr(
					Object.keys(transformations).map(key => {
						const transform = transformations[key];
						return {
							title: key,
							task: _ => transform(ctx.ast, ctx.source)
						};
					})
				);
			}
		}
	]);

	tasks
		.run()
		.then(ctx => {
			const result = ctx.ast.toSource(recastOptions);
			const diffOutput = diff.diffLines(ctx.source, result);
			diffOutput.forEach(diffLine => {
				if (diffLine.added) {
					process.stdout.write(color.green(`+ ${diffLine.value}`));
				} else if (diffLine.removed) {
					process.stdout.write(color.red(`- ${diffLine.value}`));
				}
			});
			return inquirer
				.prompt([
					{
						type: "confirm",
						name: "confirmMigration",
						message: "Are you sure these changes are fine?",
						default: "Y"
					}
				])
				.then(answers => {
					if (answers["confirmMigration"]) {
						return inquirer.prompt([
							{
								type: "confirm",
								name: "confirmValidation",
								message:
									"Do you want to validate your configuration? " +
									"(If you're using webpack merge, validation isn't useful)",
								default: "Y"
							}
						]);
					} else {
						console.log(color.red("✖ Migration aborted"));
					}
				})
				.then(answer => {
					if (!answer) return;

					runPrettier(outputConfigPath, result, err => {
						if (err) {
							throw err;
						}
					});

					if (answer["confirmValidation"]) {
						const webpackOptionsValidationErrors = validate(
							require(outputConfigPath)
						);
						if (webpackOptionsValidationErrors.length) {
							console.log(
								color.red(
									"\n✖ Your configuration validation wasn't successful \n"
								)
							);
							console.error(
								new WebpackOptionsValidationError(
									webpackOptionsValidationErrors
								).message
							);
						}
					}
					console.log(
						color.green(
							`\n✔︎ New webpack config file is at ${outputConfigPath}.`
						)
					);
					console.log(
						color.green(
							"✔︎ Heads up! Updating to the latest version could contain breaking changes."
						)
					);
					console.log(
						color.green(
							"✔︎ Plugin and loader dependencies may need to be updated."
						)
					);
				});
		})
		.catch(err => {
			const errMsg = "\n ✖ ︎Migration aborted due to some errors: \n";
			console.error(color.red(errMsg));
			console.error(err);
			process.exitCode = 1;
		});
}

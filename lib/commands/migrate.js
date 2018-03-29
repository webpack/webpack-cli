"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const diff = require("diff");
const inquirer = require("inquirer");
const PLazy = require("p-lazy");
const Listr = require("listr");

const { validate } = require("webpack");
const { WebpackOptionsValidationError } = require("webpack");

const runPrettier = require("../utils/run-prettier");

/**
 *
 * Runs migration on a given configuration using AST's and promises
 * to sequentially transform a configuration file.
 *
 * @param {Array} args - Migrate options and arguments such as input and
 * output path
 * @returns {Promise} Runs the migration using a promise that will throw any errors during each transform
 * or output if the user decides to abort the migration
 */

module.exports = function migrate(...args) {
	const filePaths = args ? args.slice(2).pop() : null;
	const currentConfigPath = args.slice(2).length === 1 ? [] : [filePaths];
	if (!filePaths.length) {
		throw new Error("Please specify a path to your webpack config");
	}
	const outputConfigPath = path.resolve(process.cwd(), filePaths[0]);
	const options = {};
	const recastOptions = Object.assign(
		{
			quote: "single"
		},
		options
	);
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
			title: "Migrating config from v1 to v2",
			task: ctx => {
				const transformations = require("../migrate").transformations;
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
					process.stdout.write(chalk.green(`+ ${diffLine.value}`));
				} else if (diffLine.removed) {
					process.stdout.write(chalk.red(`- ${diffLine.value}`));
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
						console.log(chalk.red("✖ Migration aborted"));
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
								chalk.red(
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
						chalk.green(
							`\n ✔︎ New webpack v2 config file is at ${outputConfigPath}`
						)
					);
				});
		})
		.catch(err => {
			console.log(chalk.red("✖ ︎Migration aborted due to some errors"));
			console.error(err);
			process.exitCode = 1;
		});
};

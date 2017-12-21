"use strict";

const fs = require("fs");
const chalk = require("chalk");
const diff = require("diff");
const inquirer = require("inquirer");
const PLazy = require("p-lazy");
const Listr = require("listr");

const validateSchema = require("webpack/lib/validateSchema");
const WebpackOptionsValidationError = require("webpack/lib/WebpackOptionsValidationError");
const webpackOptionsSchema = require("webpack/schemas/webpackOptionsSchema.json");

const runPrettier = require("../utils/run-prettier");

/**
*
* Runs migration on a given configuration using AST's and promises
* to sequentially transform a configuration file.
*
* @param {String} currentConfigPath - Location of the configuration to be migrated
* @param {String} outputConfigPath - Location to where the configuration should be written
* @param {Object} options - Any additional options regarding code style of the written configuration

* @returns {Promise} Runs the migration using a promise that will throw any errors during each transform
* or output if the user decides to abort the migration
*/

module.exports = function migrate(
	currentConfigPath,
	outputConfigPath,
	options
) {
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
					runPrettier(outputConfigPath, result, err => {
						if (err) {
							throw err;
						}
					});

					if (answer["confirmValidation"]) {
						const webpackOptionsValidationErrors = validateSchema(
							webpackOptionsSchema,
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

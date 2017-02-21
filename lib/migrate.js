const fs = require('fs');
const diff = require('diff');
const chalk = require('chalk');
const transform = require('./transformations').transform;
const inquirer = require('inquirer');

module.exports = (currentConfigPath, outputConfigPath) => {
	let currentConfig = fs.readFileSync(currentConfigPath, 'utf8');
	const outputConfig = transform(currentConfig);
	const diffOutput = diff.diffLines(currentConfig, outputConfig);
	diffOutput.map(diffLine => {
		if (diffLine.added) {
			process.stdout.write(chalk.green(`+ ${diffLine.value}`));
		} else if (diffLine.removed) {
			process.stdout.write(chalk.red(`- ${diffLine.value}`));
		}
	});
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'confirmMigration',
				message: 'Are you sure these changes are fine?',
				default: 'Y'
			}
		])
		.then(answers => {
			if (answers['confirmMigration']) {
				// TODO validate the config
				fs.writeFileSync(outputConfigPath, outputConfig, 'utf8');
				process.stdout.write(chalk.green(`Congratulations! Your new webpack v2 config file is at ${outputConfigPath}`));
			} else {
				process.stdout.write(chalk.yellow('Migration aborted'));
			}
		});
};

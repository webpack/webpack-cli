const fs = require('fs');
const jscodeshift = require('jscodeshift');
const diff = require('diff');
const chalk = require('chalk');
const transformations = require('./transformations');
const inquirer = require('inquirer');

module.exports = (currentConfigLoc, outputConfigLoc) => {
	let currentConfig = fs.readFileSync(currentConfigLoc, 'utf8');
	let ast = jscodeshift(currentConfig);
	let transformNames = Object.keys(transformations);
	transformNames.forEach(key => transformations[key](jscodeshift, ast));
	const outputConfig = ast.toSource();
	const diffOutput = diff.diffLines(currentConfig, outputConfig);
	diffOutput.map(diffLine => {
		if(diffLine.added) {
			process.stdout.write(chalk.green(`+ ${diffLine.value}`));
		} else if(diffLine.removed){
			process.stdout.write(chalk.red(`- ${diffLine.value}`));
		}
	});
	inquirer.prompt([{
		type: 'confirm',
		name: 'confirmMigration',
		message: 'Are you sure these changes are fine?',
		default: 'Y'}]).then(answers => {
			if(answers['confirmMigration']){
      // TODO validate the config
				fs.writeFileSync(outputConfigLoc, outputConfig, 'utf8');
				process.stdout.write(chalk.green(`Congratulations! Your new webpack v2 config file is at ${outputConfigLoc}`));
			} else {
				process.stdout.write(chalk.yellow('You aborted the migration'));
			}
		});
};
const fs = require('fs');
const diff = require('diff');
const chalk = require('chalk');
const jscodeshift = require('jscodeshift');
const transformations = require('./transformations').transformations;
const inquirer = require('inquirer');
const Listr = require('listr');

const migrateTasks = function(ast) {
	return Object.keys(transformations).map(key => {
		const transform = transformations[key];
		return {
			title: key,
			task: () => transform(ast)
		};
	});
};

module.exports = function tranformFile(currentConfigPath, outputConfigPath, options) {
	const recastOptions = Object.assign({
		quote: 'single'
	}, options);
	let currentConfig = fs.readFileSync(currentConfigPath, 'utf8');
	const ast = jscodeshift(currentConfig);
	const tasks = new Listr([
		{
			title: 'Migrating config from v1 to v2',
			task: () => new Listr(migrateTasks(ast))
		}
	]);

	tasks.run()
		.then(() => {
			const outputConfig = ast.toSource(recastOptions);
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
						process.stdout.write(chalk.green(`✔︎ New webpack v2 config file is at ${outputConfigPath}`));
					} else {
						process.stdout.write(chalk.red('✖ Migration aborted'));
					}
				});
		})
		.catch(err => {
			console.error(chalk.red('✖ ︎Migration aborted due to some errors'));
			console.error(err);
		});
};

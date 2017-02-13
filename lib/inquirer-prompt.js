const inquirer = require('inquirer');
const questions = require('./utils/observable-questions');
const chalk = require('chalk');

module.exports = function(questions, config) {
	inquirer.prompt(questions).ui.process
  .reduce(function (newOpts, ans) {
	return attachAnswers(newOpts, ans);
}, Object.assign(config, require('./utils/initial-config')))
  .flatMap(newOpts => {
	const parser = require('./parser/index');
	return parser(null, checkEmptyAnswers(newOpts));
})
  .subscribeOnError( (err) => process.stdout.write(err.toString()));
};

function attachAnswers(config, ans) {
	Object.keys(config).forEach( (configName) => {
		if(configName == ans.name) {
			config = Object.assign(config, {
				[configName]: ans.answer
			});
		}
	});
	return config;
}

function checkEmptyAnswers(config) {
	let errors = [];
	for(let key in config) {
		if(!config[key]) {
			errors[key] = chalk.gray.bold('\nFound no answer given to property ') +
			chalk.red.bold(key) + '\n';
		}
	}
	// get errors and use filter to discard the process after we've logged each error
	Object.keys(errors).map( (err) => {
		console.error(errors[err]);
	}).filter( () => {
		process.exit(0);
	});

	return config;
}

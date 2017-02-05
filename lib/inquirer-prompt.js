const inquirer = require('inquirer');
const questions = require('./utils/observable-questions');
const chalk = require('chalk');

module.exports = function(questions, config) {
	let newOpts = Object.assign(config, require('./utils/initial-config'));
	inquirer.prompt(questions).ui.process.subscribe(
		function handleAnswer(ans) {
			return attachAnswers(newOpts, ans);
		},
		function handleError(err) {
			console.error('Error: ', err);
			process.exit(-1);
		},
		function onCompleted() {
			checkEmptyAnswers(newOpts);
			const parser = require('./parser/index');
			return parser(null, config);
		}
	);
};

function attachAnswers(config, ans) {
	const { name, answer } = ans;
	Object.keys(config).forEach( (configName) => {
		if(configName == name) {
			config[configName] = answer;
		}
	});
	return;
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

	return;
}

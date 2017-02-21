const inquirer = require('inquirer');
const chalk = require('chalk');

/*
* @function prompt
*
* Initializes an inquirer instance with questions provided from the --init feature
*
* @param { Object } questions - questions to be prompted in RxJS format
* @param { Object } config - Configuration passed from an addon to be included in
* answers, later sent down to the parser
* @returns { Function } Parser function that validates the answers, later transforming
* the answers to an webpack configuration
*/

module.exports = function prompt(questions, config) {
	inquirer.prompt(questions).ui.process
	.reduce(function (newOpts, ans) {
		return attachAnswers(newOpts, ans);
	}, Object.assign(config, require('./utils/initial-config')))
	.map(function(newOpts) {
		const parser = require('./parser/index');
		return parser(null, checkEmptyAnswers(newOpts));
	})
	.subscribeOnError((err) => {
		process.stdout.write(err.toString());
	});
};

/*
* @function attachAnswers
*
* Adds the answers from the inquirer instance if the type of the question is
* equal to the configuration property
*
* @param { Object } config - initial questions provided from --init
* @param { Object } answers - The answers passed from the inquirer instance
* @returns { Object } newConfig - An new object with the answers added to it
*/

function attachAnswers(config, answers) {
	let newConfig;
	Object.keys(config).forEach( (configName) => {
		if(configName == answers.name) {
			newConfig = Object.assign(config, {
				[configName]: answers.answer
			});
		}
	});
	return newConfig;
}

/*
* @function checkEmptyAnswers
*
* Checks for empty answers that didn't get attached from the prompt because it didn't match
* the given configuration property. If it finds an empty answer, it throws an error after logging
* each error to the console
*
* @param { Object } config - initial questions provided from --init
* @returns { Object } config - returns the configuration,
* as RxJS needs to have a return value to keep track of its context
*/

function checkEmptyAnswers(config) {
	let errors = [];
	for(let key in config) {
		if(!config[key]) {
			errors[key] = chalk.gray.bold('\nFound no answer given to property ') +
			chalk.red.bold(key) + '\n';
		}
	}
	Object.keys(errors).map( (err) => {
		console.error(errors[err]);
	}).filter( () => {
		process.exit(1);
	});
	return config;
}

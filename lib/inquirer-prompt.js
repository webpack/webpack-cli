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
	.subscribe(ans => {
		config = require(`./init-transforms/${ans.name}`)(config, ans.answer);
	}, err => process.stdout.write(err.toString()),
	() => {
		console.log(chalk.white('We managed to generate a webpack config for you.'));
		// TODO pass through prettier
		console.log(chalk.green(JSON.stringify(config.toConfig())));
	});
};

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

const inquirer = require('inquirer');
const parse = require('./parser/index');
const questions = require('./utils/observable-questions');

module.exports = function(questions, config) {

	inquirer.prompt(questions).ui.process.subscribe(
		function handleAnswer(ans) {
			return attachAnswers(config, ans);
		},
		function handleError(err) {
			console.error('Error: ', err);
		},
		function onCompleted() {
			checkEmptyAnswers(config);
			return parse(null, config);
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
	for(let key in config) {
		if(!config[key]) {
			console.error('\nFound no answer given to property', key);
			console.error('Check if you have the same name for the inquirer property!');
			process.exit(0);
		}
	}
	return;
}

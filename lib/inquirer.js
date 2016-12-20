const inquirer = require('inquirer');
const questions = require('./observable-questions.js');

inquirer.prompt(questions).ui.process.subscribe(
	(ans) => {
		console.log(ans);
	},
	(err) => {
		console.log('Error: ', err);
	},
	() => {
		console.log('done!');
	}
);

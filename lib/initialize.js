const inquirer = require('inquirer');
const questions = require('./utils/observable-questions');
const validateAddons = require('./utils/validate-addons');
const parse = require('./parser/index');

module.exports = function initializeInquirer(pkg) {
	if(pkg.length == 0) {
		//eslint-disable-next-line
		let entry,output = {};
		inquirer.prompt(questions).ui.process.subscribe(
			(ans) => {
				if(ans.name === 'entry') entry = ans.answer;
				else output = ans.answer;
			},
			(err) => {
				console.log('Error: ', err);
			},
			function inquirerParser() {
				parse(null, {entry,output});
			}
		);
	} else {
		validateAddons(pkg);
		// hook parser with promise?
	}
};

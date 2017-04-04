const inquirer = require('inquirer');

// we can use rxJS here to validate the answers against a generator
module.exports = class WebpackAdapter {
	prompt(questions, callback) {
		const promise = inquirer.prompt(questions);
		promise.then(callback || function(){});
		return promise;
	}
};

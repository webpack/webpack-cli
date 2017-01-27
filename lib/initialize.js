const questions = require('./utils/observable-questions');
const validateAddons = require('./utils/validate-addons');
const inq = require('./inquirer-prompt');

//TODO: add with flag to check if there could be a dependency beneath later
module.exports = function initializeInquirer(pkg) {
	if(pkg.length == 0) {
		let config = {
			entry: '',
			output: ''
		};
		inq(questions, config);
	} else {
		validateAddons(pkg);
	}
};

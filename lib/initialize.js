const questions = require('./utils/observable-questions');
const validateAddons = require('./utils/validate-addons');
const inq = require('./inquirer-prompt');
const Rx = require('rx');

//TODO: allow to add question to the call
module.exports = function initializeInquirer(pkg) {
	if(pkg.length == 0) {
		let config = {
			entry: '',
			output: ''
		};
		inq(Rx.Observable.from(questions), config);
	}
	else {
		validateAddons(pkg);
	}
};

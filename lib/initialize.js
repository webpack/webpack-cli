const questions = require('./utils/observable-questions');
const validateAddons = require('./utils/validate-addons');
const inq = require('./inquirer-prompt');
const initialConfig = require('./utils/initial-config');
const Rx = require('rx');


module.exports = function initializeInquirer(pkg) {
	if(pkg.length == 0) {
		return inq(Rx.Observable.from(questions), initialConfig);
	}
	else {
		return validateAddons(pkg);
	}
};

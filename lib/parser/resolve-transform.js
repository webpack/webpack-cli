//TODO: Get the inq prompt and return the parser once again until there's no packages left to validate.
const inq = require('../inquirer-prompt');
const questions = require('../utils/observable-questions');
const Rx = require('rx');
module.exports = function resolveTransform(pkg, opts) { //eslint-disable-line
	var que = questions.concat(pkg());
	var n = Rx.Observable.from(que);
	var config = {
		resolve: ''
	};
	inq(n, config);
};

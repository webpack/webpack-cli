'use strict';
//TODO: Get the inq prompt and return the parser once again until there's no packages left to validate.
const Rx = require('rx');
const prompt = require('../inquirer-prompt');
const questions = require('../utils/initial-questions');

module.exports = function resolveDependency(pkg) {
	const pkgQuestions = questions.concat(pkg.inquirer);
	const pkgAddon = Rx.Observable.from(pkgQuestions);

	return prompt(pkgAddon, pkg.config);
};

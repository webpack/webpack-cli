//TODO: Get the inq prompt and return the parser once again until there's no packages left to validate.
const inq = require('../inquirer-prompt');
const questions = require('../utils/initial-questions');
const Rx = require('rx');

module.exports = function resolveTransform(pkg) { //eslint-disable-line
	let pkgQuestions = questions.concat(pkg.inquirer);
	let pkgAddon = Rx.Observable.from(pkgQuestions);

	inq(pkgAddon, pkg.config);
};

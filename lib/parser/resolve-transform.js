'use strict';

const Rx = require('rx');
const prompt = require('../inquirer-prompt');

module.exports = function resolveTransform(pkg) {
	const pkgAddon = Rx.Observable.from(pkg.webpack.inquirer);
	return prompt(pkgAddon, pkg.webpack.config);
};

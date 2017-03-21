'use strict';

const Rx = require('rx');
const prompt = require('../inquirer-prompt');

module.exports = function resolveTransform(pkg, pkgName) {
	const pkgAddon = Rx.Observable.from(pkg[pkgName].inquirer);
	return prompt(pkgAddon, pkg[pkgName].config);
};

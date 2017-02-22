/* eslint node/no-unsupported-features: 0 */
'use strict';
const Rx = require('rx');
const questions = require('../../lib/utils/initial-questions');
const exists = require('../../lib/utils/npm-exists');
const initialConfig = require('../../lib/utils/initial-config');

//eslint-disable-next-line
const prompt = require('./prompt.mock');

async function npmPackagesExists(addon) {
	let arr = [];
	for(let k of addon) {
		arr.push(await exists(k));
	}
	return arr;
}

function init(pkg, answer) {
	// In the regular module, this is automatically an empty array, becomes `pkg.length == 0`
	// We're adding manually the answers here as an argument for testing
	if(!pkg) {
		return prompt(Rx.Observable.from(questions), initialConfig, answer);
	}
	else { /* noop for now, manually testing addons */ }
}


module.exports = {
	npmPackagesExists,
	init
};

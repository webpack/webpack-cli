/* eslint node/no-unsupported-features: 0 */
'use strict';
const Rx = require('rx');
const got = require('got');
const questions = require('../../lib/utils/initial-questions');
//eslint-disable-next-line
const prompt = require('./prompt.mock');
const initialConfig = jest.genMockFromModule('../../lib/utils/initial-config');


function exists(pkg) {
	const hostname = 'https://www.npmjs.org';
	const pkgUrl = `${hostname}/package/${pkg}`;
	return got(pkgUrl, {method: 'HEAD'})
			.then( () => {
				return true;
			})
			.catch(() => {
				return false;
			});
}

//
async function validateAddons(addon) {
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
	exists,
	validateAddons,
	init
};

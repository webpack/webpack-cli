'use strict';
/* eslint-disable */
const questions = require('../../../lib/utils/observable-questions');
const prompt = require('prompt.mock');
const initialConfig = jest.genMockFromModule('../../../lib/utils/initial-config');
const Rx = require('rx');
const got = require('got');

let mockInitialize = {};

mockInitialize.exists = function exists(pkg) {
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

mockInitialize.validateAddon = async (addon) => mockInitialize.exists(addon)

mockInitialize.validateAddons = async (addon) => {
	return Object.keys(addon).forEach( (pkg) => {
		return mockInitialize.exists(addon[pkg]);
	});
}

mockInitialize.init = function init(pkg, answer) {
	// In the regular module, this is automatically an empty array, becomes `pkg.length == 0`
	// We're adding manually the answers here as an argument for testing
	if(!pkg) {
		return prompt(Rx.Observable.from(questions), initialConfig, answer);
	}
	else { /* noop for now, manually testing addons */ }
}


module.exports = mockInitialize

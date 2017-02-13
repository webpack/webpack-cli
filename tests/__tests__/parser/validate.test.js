/* eslint node/no-unsupported-features: 0 */
'use strict';
require('babel-polyfill') //eslint-disable-line


/*
 * We should find a more convinient way to test this. Also, the error message is written with
 * Chalk, so copying what is in the error message is hard. Regardless, it should have a slighlty more
 * specific test case instead of checking only the error type.
 */

const validateAddons = require('../../../lib/utils/validate-addons');

describe('Addon Validation', () => {
	it('Should notify if the package isn\'t prefixed', async () => {
		try {
			await validateAddons(['webpack']);
		} catch (object) {
			expect(object.toString()).toContain('TypeError:');
		}
	});
	it('Should complain about only supplying \'webpack-addon\' as the name', async () => {
		try {
			await validateAddons(['webpack-addons']);
		} catch (object) {
			expect(object.toString()).toContain('TypeError:');
		}
	});
	it('Should complain about unregistered packages', () => {
		// error shows up in console as we're handling it instead of throwing an actual error.
		expect(validateAddons(['webpack-addons-ylvis'])).toBeDefined();
	});
});

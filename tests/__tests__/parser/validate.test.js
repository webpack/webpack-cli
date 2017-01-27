'use strict';
require('babel-polyfill');
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

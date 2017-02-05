/* eslint node/no-unsupported-features: 0 */

'use strict';
require('babel-polyfill'); // eslint-disable-line
const validateAddons = require('../../../lib/utils/validate-addons');

describe('Addon Validation', () => {
	it('Should notify if the package isn\'t prefixed', async () => {
		try {
			await validateAddons(['webpack']);
		} catch (object) {
			expect(object.toString()).toEqual('TypeError: Package isn\'t a valid name\n' +
			'It should be prefixed with \'webpack-addon\'');
		}
	});
	it('Should complain about only supplying \'webpack-addon\' as the name', async () => {
		try {
			await validateAddons(['webpack-addon']);
		} catch (object) {
			expect(object.toString()).toEqual('TypeError: \'webpack-addon\' is not a valid addon');
		}
	});
	it('Should complain about unregistered packages', () => {
		// error shows up in console as we're handling it instead of throwing an actual error.
		expect(validateAddons(['webpack-addon-trinity'])).toBeDefined();
	});
});

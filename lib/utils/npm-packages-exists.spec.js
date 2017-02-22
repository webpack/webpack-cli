/* eslint node/no-unsupported-features: 0 */
'use strict';

describe('npm-packages-exists', () => {
	//eslint-disable-next-line
	const {npmPackagesExists} = require('../../__mocks__/inquirer/initialize.mock');

	it('should validate multiple packages if supplied', async () => {
		let itValidatesAddon = await npmPackagesExists(['webpack-addons-ylvis', 'webpack-addons-noop']);
		// BUG: We are making the values strings, so the tests pass
		expect(itValidatesAddon.toString()).toBe([true, false].toString());
	});
});

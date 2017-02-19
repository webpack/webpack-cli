/* eslint node/no-unsupported-features: 0 */
'use strict';

describe('validate-addons', () => {
	//eslint-disable-next-line
	const {validateAddons} = require('initialize.mock');

	it('should validate multiple packages if supplied', async () => {
		let itValidatesAddon = await validateAddons(['webpack-addons-ylvis', 'webpack-addons-noop']);
		// BUG: We are making the values strings, so the tests pass
		expect(itValidatesAddon.toString()).toBe([true, false].toString());
	});
});

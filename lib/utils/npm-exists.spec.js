/* eslint node/no-unsupported-features: 0 */
'use strict';

describe('exists', () => {
	//eslint-disable-next-line
	const {exists} = require('initialize.mock');

	it('should sucessfully existence of a published module', async () => {
		let itExists = await exists('webpack-addons-ylvis');
		expect(itExists).toBe(true);
	});

	it('should return false for the existence of a fake module', async () => {
		let itExists = await exists('webpack-addons-noop');
		expect(itExists).toBe(false);
	});
});

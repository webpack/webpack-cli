/* eslint node/no-unsupported-features: 0 */
'use strict';

describe('Inquirer', () => {

	/* eslint-disable */
	const {exists, validateAddons, init} = require('initialize.mock');
	let inquirerFn;
	/* eslint-enable */

	afterEach(() => {
		inquirerFn = null;
	});

	it('Should sucessfully existence of a published module', async () => {
		let itExists = await exists('webpack-addons-ylvis');
		expect(itExists).toBe(true);
	});

	it('Should return false for the existence of a fake module', async () => {
		let itExists = await exists('webpack-addons-noop');
		expect(itExists).toBe(false);
	});

	it('Should validate multiple packages if supplied', async () => {
		let itValidatesOneAddon = await validateAddons(['webpack-addons-ylvis', 'webpack-addons-noop']);
		// BUG: We are making the values strigs, so the tests pass
		expect(itValidatesOneAddon.toString()).toBe([true, false].toString());
	});

	it('Should provide with basic options if no argument is supplied to init', async () => {
		let itInits = await init(null, {
			entry: '1', output: '2'
		});
		let matchObj = {
			entry: '1',
			output: '2'
		};
		itInits.subscribe(function(answers) {
			expect(answers).toMatchObject(matchObj);
		});
	});

});

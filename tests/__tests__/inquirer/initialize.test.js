/* eslint-disable */
'use strict';

describe('Inquirer', () => {
	const {exists, validateAddons, init} = require('initialize.mock');
	let inquirerFn;

	afterEach(() => {
  		inquirerFn = null;
	});

	it('Should sucessfully existence of a published module', async () => {
		let itExists = await exists('webpack-addons-ylvis')
		expect(itExists).toBe(true);
	});

	it('Should return false for the existence of a fake module', async () => {
		let itExists = await exists('webpack-addons-noop')
		expect(itExists).toBe(false);
	});

	it('Should validate multiple packages if supplied', async () => {
		//FIXME: Exists need to capture the validateAddons call.
		inquirerFn = jest.fn(exists)
		let itValidatesOneAddon = validateAddons(['webpack-addons-ylvis', 'webpack-addons-noop']);
		expect(inquirerFn).toHaveBeenCalledWith(['webpack-addons-ylvis', 'webpack-addons-noop']);
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

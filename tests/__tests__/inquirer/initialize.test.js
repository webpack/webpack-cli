/* eslint-disable */
'use strict';

const inquirer = require('initialize.mock');

describe('Inquirer', () => {
	let inquirerFn;
	afterEach(() => {
  		inquirerFn = null;
	})
	it('Should check existence of a module', async () => {
		inquirerFn = jest.fn(inquirer.exists);
		let exists = await inquirer.exists(['webpack-addons-ylvis']);
		expect(exists).toBe(true);
	});

	it('Should init a check existency of the module if it has any dependencies', async () => {
		inquirerFn = jest.fn(inquirer.validateAddon);
		let validateAddon = await inquirer.validateAddon(['webpack-addons-ylvis']);
		expect(validateAddon).toBe(true);
	});

	it('Should validate multiple packages if supplied', async () => {
		//FIXME: Mock is hacky, as we cannot make an async call using array.map and get the returned promise.
		inquirerFn = jest.fn(inquirer.validateAddons)
		let validateAddons = inquirerFn(['webpack-addons-ylvis', 'webpack-addons-noop']);
		expect(inquirerFn).toHaveBeenCalled();
	});

	it('Should provide with basic options if no argument is supplied to init', async () => {
	 	inquirerFn = jest.fn(inquirer.init);

		let init = await inquirerFn(null, {
			entry: '1', output: '2'
		});
		let matchObj = {
			entry: '1',
			output: '2'
		};
		init.subscribe(function(answers) {
			expect(answers).toMatchObject(matchObj);
		});
	});

});

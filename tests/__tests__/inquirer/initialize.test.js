/* eslint-disable */
'use strict';

const inquirer = require('initialize.mock'); // eslint-disable-line
describe('Inquirer', () => {
	it('Should check existence of a module', async () => {
		let exists = await inquirer.exists(['webpack-addons-ylvis']);
		expect(exists).toBe(true);
	});
	it('Should init a check existency of the module if it has any dependencies', async () => {
		//FIXME: Mock is hacky, as we cannot make an async call using array.map and get the returned promise.
		let exists = await inquirer.validateAddon(['webpack-addons-ylvis']);
		expect(exists).toBe(true);
	});
	it('Should validate multiple packages if supplied', async () => {
		var	mockAddons = jest.fn(inquirer.validateAddons(['webpack-addons-ylvis']));
		expect(mockAddons).toHaveBeenCalledTimes(2);
	});
	it('Should provide with basic options if no argument is supplied to init', async () => {
		let inqprompt = await inquirer.init(null, {
			entry: '1', output: '2'
		});
		var matchObj = {
			entry: '1',
			output: '2'
		};
		inqprompt.subscribe(function(x) {
			expect(x).toMatchObject(matchObj);
		});
	});
});

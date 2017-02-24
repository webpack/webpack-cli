/* eslint node/no-unsupported-features: 0 */
'use strict';

describe('inquirer-prompt', () => {
	//eslint-disable-next-line
	const {init} = require('../__mocks__/inquirer/initialize.mock');

	it('should provide with basic options if no argument is supplied to init', async () => {
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

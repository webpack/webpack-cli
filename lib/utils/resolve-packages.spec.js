'use strict';

const getLoc = require('../../__mocks__/inquirer/resolve.mock');

describe('resolve-packages', () => {
	let moduleLoc;

	afterEach(() => {
		moduleLoc = null;
	});

	it('should resolve a location of a published module', () => {
		moduleLoc = getLoc(['webpack-addons-ylvis']);
		expect(moduleLoc).toEqual(['../../node_modules/webpack-addons-ylvis']);
	});

	it('should be empty if argument is blank', () => {
		// normally caught before getting resolved
		moduleLoc = getLoc([' ']);
		expect(moduleLoc).toEqual(['../../node_modules/ ']);
	});

	it('should resolve multiple locations of published modules', () => {
		/* we're testing multiple paths here. At Github this up for discussion, because if
		 * we validate each package on each run, we can catch and build the questions in init gradually
		 * while we get one filepath at the time. If not, this is a workaround.
		 */
		moduleLoc = getLoc(['webpack-addons-ylvis', 'webpack-addons-noop']);
		expect(moduleLoc).toEqual(
			['../../node_modules/webpack-addons-ylvis', '../../node_modules/webpack-addons-noop']
		);
	});
});

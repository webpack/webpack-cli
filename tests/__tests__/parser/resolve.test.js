'use strict';

const parser = require('resolve.mock'); // eslint-disable-line

describe('Parser', () => {

	it('Should find a path to a module after it is installed', () => {
		expect(parser.getLoc(['webpack-addons-ylvis'])).toEqual('../../node_modules/webpack-addons-ylvis');
	});

	it('Should be empty if argument is blank', () => {
		// this is caught before going into the resolver, normally
		expect(parser.getLoc([' '])).toEqual('../../node_modules/ ');
	});
});

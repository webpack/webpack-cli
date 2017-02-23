'use strict';

describe('validate-options', () => {
	//eslint-disable-next-line
	const {validateOptions} = require('../../__mocks__/parser/validate-options.mock');

	it('should throw on fake paths', () => {
		expect(() => {
			validateOptions({entry: 'noop', output: 'noopsi'});
		}).toThrowError('Did not find the file');
	});

	it('should find the real files', () => {
		expect(() => {
			validateOptions({entry: 'package.json'});
		}).not.toThrowError('Did not find the file');
	});

});

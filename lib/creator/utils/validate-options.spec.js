'use strict';

const validateOptions = require('../../../__mocks__/creator/validate-options.mock').validateOptions;

describe('validate-options', () => {

	it('should throw on fake paths', () => {
		expect(() => {
			validateOptions({entry: 'noop', output: 'noopsi'});
		}).toThrowError('Did not find the file');
	});

	it('should find the real files', () => {
		expect(() => {
			validateOptions({entry: 'package.json'});
		}).not.toThrowError(/'Did not find the file'/);
	});

});

'use strict';

const replaceGeneratorName = require('./index').replaceGeneratorName;

describe('replaceGeneratorName', () => {

	it('should replace a pattern of an addon', () => {
		const generatorName = replaceGeneratorName('webpack-addons-thefox');
		expect(generatorName).toEqual('generator-thefox');
	});

});

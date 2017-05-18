'use strict';

var replaceGeneratorName = require('./index').replaceGeneratorName;

describe('replaceGeneratorName', () => {

	it('should replace a pattern of an addon', () => {
		var generatorName = replaceGeneratorName('webpack-addons-thefox');
		expect(generatorName).toEqual('generator-thefox');
	});

});

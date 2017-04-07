'use strict';

function replaceGeneratorName(name) {
	return name.replace(
      /(webpack-addons)?([^:]+)(:.*)?/g, 'generator$2');
}

describe('replaceGeneratorName', () => {

	it('should replace a pattern of an addon', () => {
		const generatorName = replaceGeneratorName('webpack-addons-thefox');
		expect(generatorName).toEqual('generator-thefox');
	});

});

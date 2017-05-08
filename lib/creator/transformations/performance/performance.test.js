const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'performance', 'performance-0', {
	hints: '\'warning\'',
	maxEntrypointSize: 400000,
	maxAssetSize: 100000,
	assetFilter: 'function(assetFilename) {' +
		'return assetFilename.endsWith(\'.js\');' +
	'}'
});

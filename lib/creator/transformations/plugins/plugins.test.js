const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'plugins', 'plugins-0', [
	'new webpack.optimize.CommonsChunkPlugin({name:' + '\'' + 'vendor' + '\'' + ',filename:' + '\'' + 'vendor' + '-[hash].min.js\'})'
]);

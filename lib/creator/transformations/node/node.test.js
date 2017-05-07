const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'node', 'node-0', {
	console: false,
	global: true,
	process: true,
	Buffer: true,
	__filename: 'mock',
	__dirname: 'mock',
	setImmediate: true
});

const defineTest = require('../../../transformations/defineTest');
const jscodeshift = require('jscodeshift');

defineTest(__dirname, 'output', 'output-0', {
	filename: '\'bundle\'',
	path: '\'dist/assets\'',
	pathinfo: true,
	publicPath: '\'https://google.com\'',
	sourceMapFilename: '\'[name].map\'',
	sourcePrefix: jscodeshift('\'\t\''),
	umdNamedDefine: true,
	strictModuleExceptionHandling: true
});

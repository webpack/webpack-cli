module.exports = {
	entry: 'index.js',
	output: {
		filename: "'bundle'",
		path: "'dist/assets'",
		pathinfo: true,
		publicPath: "'https://google.com'",
		sourceMapFilename: "'[name].map'",
		sourcePrefix: jscodeshift("'\t'"),
		umdNamedDefine: true,
		strictModuleExceptionHandling: true
	},
}

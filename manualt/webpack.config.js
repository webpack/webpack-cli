const webpack = require('webpack');
module.exports = {
	module: {
		rules: [],
		exprContextCritical: true
	},

	entry: './src/a',

	output: {
		filename: '[name].[chunkhash].js'
	},

	devtool: false
};

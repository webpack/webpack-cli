// Don't modify LoaderOptionsPlugin

const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: ['./index.js'],
    output: {
        filename: 'bundle.js'
    },
    module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract([
				'css-loader'
			])
		}]
	},
}

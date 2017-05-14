const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const srcPath = '../dummy';
const distPath = '../dummy/dist';

module.exports = {
	context: srcPath,
	entry: {
		foo: './css/pages/foo.css',
		bar: './css/pages/bar.css'
	},
	output: {
		path: distPath,
		publicPath: '/assets/',
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract([
				'css-loader'
			])
		}]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: 2
		}),
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash:base64:5].css',
			allChunks: true
		})
	]
};

const path = require('path');

module.exports = {
	devtool: 'eval',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['babel'],
			include: path.join(__dirname, 'src')
		}]
	},
	resolve: {
		root: path.resolve('/src'),
		modules: ['node_modules']
	}
};

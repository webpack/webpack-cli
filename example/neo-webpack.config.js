var path = require('path');


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
		rules: [{
			test: /\.js$/,
			use: ['babel'],
			include: path.join(__dirname, 'src')
		}]
	}
};

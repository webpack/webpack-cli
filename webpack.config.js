const webpack = require('webpack');
module.exports = {
	plugins: [
		new webpack.CommonJsPlugin(),
		new webpack.DefinePlugin('/* Add your arguments here */')
	]
};

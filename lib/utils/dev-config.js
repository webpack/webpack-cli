const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',

	plugins: [
		new webpack.ProgressPlugin(),
	],

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				include: [],
				loader: 'babel-loader',

				options: {
					plugins: ['syntax-dynamic-import'],

					presets: [
						[
							'@babel/preset-env',
							{
								modules: false
							}
						]
					]
				}
			}
		]
	},

	optimization: {
		minimizer: [new TerserPlugin()],
	}
};

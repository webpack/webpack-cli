const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract("style-loader", "css-loader")
			}
		]
	},
	plugins: [new ExtractTextPlugin("styles.css")]
};

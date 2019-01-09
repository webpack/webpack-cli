const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
	debug: true,
	plugins: [
		new TerserPlugin(),
		new webpack.LoaderOptionsPlugin({
			foo: 'bar'
		})
	]
}

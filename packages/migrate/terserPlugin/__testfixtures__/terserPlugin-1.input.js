const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
	devtool: "source-map",
	plugins: [
		new TerserPlugin({
			sourceMap: true,
			compress: {}
		})
	]
};

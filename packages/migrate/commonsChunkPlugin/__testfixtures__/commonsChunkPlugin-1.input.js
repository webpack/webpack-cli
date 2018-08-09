module.export = {
	entry: {
		vendor: './src/vendors.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["common", "vendor"]
		})
	]
}

module.exports = {
	entry: {
		app: './src/app.js',
		vendor: './src/vendors.js',
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["app", "vendor"],
			minChunks: 2
		})
	]
}

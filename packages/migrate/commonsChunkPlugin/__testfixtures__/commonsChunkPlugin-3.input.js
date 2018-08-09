module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "commons",
			filename: "commons.js",
		})
	]
}

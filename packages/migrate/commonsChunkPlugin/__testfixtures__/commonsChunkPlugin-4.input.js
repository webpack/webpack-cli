module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			async: true,
			minSize: 2000,
		})
	]
}

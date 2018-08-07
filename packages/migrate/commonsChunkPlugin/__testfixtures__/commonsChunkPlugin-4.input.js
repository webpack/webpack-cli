module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			async: true,
			minSize: 0,
			minChunks: 2
		})
	]
}

module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			minChunks: ({ resource }) => /node_modules/.test(resource),
		})
	]
}

module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime",
			minChunks: Infinity,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "modules",
			minChunks: ({ resource }) => /node_modules/.test(resource),
		}),
	]
}

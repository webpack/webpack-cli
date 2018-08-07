module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["main", "vendor"],
			minChunks: Infinity,
		})
	]
}

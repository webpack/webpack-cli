module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor"]
		})
	]
}

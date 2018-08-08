module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["main", "vendor"]
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "app"
		})
	]
}

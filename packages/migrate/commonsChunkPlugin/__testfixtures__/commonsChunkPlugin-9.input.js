module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["main", "runtime"]
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "app"
		})
	]
}

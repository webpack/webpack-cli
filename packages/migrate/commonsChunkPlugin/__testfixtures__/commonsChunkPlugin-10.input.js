module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "app"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime"
		})
	]
}

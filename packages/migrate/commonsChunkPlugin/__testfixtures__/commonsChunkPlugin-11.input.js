module.export = {
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			minSize: 3000,
		}),
	]
}

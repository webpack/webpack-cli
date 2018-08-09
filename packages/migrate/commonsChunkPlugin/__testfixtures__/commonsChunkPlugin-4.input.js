module.export = {
	entry: {
		main: './src/index.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			async: true,
			minSize: 2000,
		})
	]
}

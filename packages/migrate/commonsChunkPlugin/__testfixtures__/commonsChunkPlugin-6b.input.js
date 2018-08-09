module.export = {
	entry: {
		main: './src/index.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			minChunks: ({ resource }) => {
				var foo = "bar";
				return /node_modules/.test(resource);
			},
		})
	]
}

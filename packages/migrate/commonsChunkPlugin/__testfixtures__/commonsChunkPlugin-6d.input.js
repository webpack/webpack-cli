module.exports = {
	entry: {
		main: './src/index.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			minChunks: function ({ resource }) {
				if (foo) {
					return /node_modulesfoo/.test(resource);
				} else {
					return /node_modulesbaz/.test(resource);
				}
			}
		})
	]
}

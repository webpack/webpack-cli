module.exports = {
	entry: {
		main: './src/index.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "main",
			minChunks: function ({ resource }) {
				var foo = "bar";
				if (foo) {
					return /node_modulesfoo/.test(resource);
				} else if (foo === "something") {
					return /node_modulesbar/.test(resource);
				} else {
					return /node_modulesbaz/.test(resource);
				}
			}
		})
	]
}

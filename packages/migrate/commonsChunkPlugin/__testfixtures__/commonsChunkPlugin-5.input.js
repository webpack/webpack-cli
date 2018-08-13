module.exports = {
	entry: {
		main: './src/index.js',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["main", "runtime"],
		})
	]
}

module.exports = {
	debug: true,
	plugins: [
		new webpack.optimize.TerserPlugin(),
		new webpack.LoaderOptionsPlugin({
			foo: 'bar'
		})
	]
}

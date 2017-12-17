module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	devServer: {
	contentBase: "edSheeran",
	compress: true,
	port: 9000
}
}

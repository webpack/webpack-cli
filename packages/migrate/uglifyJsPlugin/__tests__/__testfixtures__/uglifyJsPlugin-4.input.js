module.exports = {
	devtool: 'eval',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js'
	},
	module: {
		loaders: [{
			test: /.js$/,
			loaders: ['babel'],
			include: path.join(__dirname, 'src')
		}]
	},
	resolve: {
		root: path.resolve('/src'),
		modules: ['node_modules']
	},
	plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	debug: true
};

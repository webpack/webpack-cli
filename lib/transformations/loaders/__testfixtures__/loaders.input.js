export default [{
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader'
		}]
	}
}, {
	module: {
		loaders: [{
			test: /\.css$/,
			loader: 'style-loader!css-loader?modules=true'
		}]
	}
}, {
	module: {
		loaders: [{
			test: /\.css$/,
			loaders: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
				query: {
					modules: true
				}
			}]
		}]
	}
}, {
	module: {
		preLoaders:[{
			test: /\.js$/,
			loader: 'eslint-loader'
		}]
	}
}, {
	module: {
		postLoaders:[{
			test: /\.js$/,
			loader: 'my-post-loader'
		}]
	}
}, {
	module: {
		preLoaders:[{
			test: /\.js$/,
			loader: 'eslint-loader'
		}],
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader'
		}]
	}
}, {
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader'
		}],
		postLoaders:[{
			test: /\.js$/,
			loader: 'my-post-loader'
		}]
	}
}];
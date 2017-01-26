export default [{
	module: {
		rules: [{
			test: /\.js$/,
			use: 'babel-loader'
		}]
	}
}, {
	module: {
		rules: [{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
				options: {
					modules: true,
					importLoaders: 1,
					string: 'test123'
				}
			}]
		}]
	}
}, {
	module: {
		rules: [{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
				options: {
					modules: true
				}
			}]
		}]
	}
}, {
	module: {
		rules:[{
			test: /\.js$/,
			use: 'eslint-loader',
			enforce: 'pre'
		}]
	}
}, {
	module: {
		rules:[{
			test: /\.js$/,
			use: 'my-post-loader',
			enforce: 'post'
		}]
	}
}, {
	module: {
		rules: [{
			test: /\.js$/,
			use: 'babel-loader'
		}, {
			test: /\.js$/,
			use: 'eslint-loader',
			enforce: 'pre'
		}]
	}
}, {
	module: {
		rules: [{
			test: /\.js$/,
			use: 'babel-loader'
		}, {
			test: /\.js$/,
			use: 'my-post-loader',
			enforce: 'post'
		}]
	}
}];

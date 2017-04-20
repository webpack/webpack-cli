const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'module', 'module-0', {module: {
	rules: [{
		test: new RegExp(/\.(js|vue)$/),
		loader: '\'eslint-loader\'',
		enforce: '\'pre\'',
		include: ['customObj', '\'Stringy\''],
		options: {
			formatter: '\'someOption\''
		}
	}, {
		test: new RegExp(/\.vue$/),
		loader: '\'vue-loader\'',
		options: 'vueObject'
	}, {
		test: new RegExp(/\.js$/),
		loader: '\'babel-loader\'',
		include: ['resolve(\'src\')', 'resolve(\'test\')']
	}, {
		test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
		loader: '\'url-loader\'',
		options: {
			limit: 10000,
			name: 'utils.assetsPath(\'img/[name].[hash:7].[ext]\')'
		}
	}, {
		test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
		loader: '\'url-loader\'',
		options: {
			limit: '10000',
			name: 'utils.assetsPath(\'fonts/[name].[hash:7].[ext]\')',
			someArr: ['Hey']
		}
	}]
}});

defineTest(__dirname, 'module', 'module-1', {module: {
	noParse: /jquery|lodash/,
	rules: [{
		test: new RegExp(/\.js$/),
		parser: {
			amd: false
		}
	}]
}});

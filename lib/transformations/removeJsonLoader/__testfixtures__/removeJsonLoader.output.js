export default [{
	module: {
		rules: [{
			test: /\.yml/,
			use: ['another-loader', 'yml-loader']
		}]
	}
}, {
	module: {
		rules: [{
			test: /\.yml/,
			use: 'yml-loader'
		}]
	}
}, {
	module: {
		rules: []
	}
}];

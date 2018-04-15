module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	externals: {
        highdash: {
            commonjs: 'lodash',
            amd: 'lodash'
        }
    }
}

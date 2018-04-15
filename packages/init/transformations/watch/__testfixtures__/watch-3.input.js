module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	watchOptions: {
		aggregateTimeout: 100,
		poll: 90,
		ignored: "/ok/"
	},
	watch: 'me'
}

module.exports = {
	optimizations: {
		splitChunks: false
	},
	plugins: [new Foo(), new webpack.optimize.ModuleConcatenationPlugin()]
};

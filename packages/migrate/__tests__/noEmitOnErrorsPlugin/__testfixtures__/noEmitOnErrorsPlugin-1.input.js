module.exports = {
	optimizations: {
		splitChunks: false
	},
	plugins: [new Foo(), new webpack.NoEmitOnErrorsPlugin()]
};

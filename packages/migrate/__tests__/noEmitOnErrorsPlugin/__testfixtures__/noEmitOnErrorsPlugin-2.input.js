module.exports = {
	optimizations: {
		noEmitOnErrors: false
	},
	plugins: [new Foo(), new webpack.NoEmitOnErrorsPlugin()]
};

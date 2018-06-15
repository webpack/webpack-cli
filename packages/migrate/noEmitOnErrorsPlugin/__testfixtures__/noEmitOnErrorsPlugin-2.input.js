module.export = {
	optimizations: {
		noEmitOnErrors: false
	},
    plugins: [
        new Foo(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}

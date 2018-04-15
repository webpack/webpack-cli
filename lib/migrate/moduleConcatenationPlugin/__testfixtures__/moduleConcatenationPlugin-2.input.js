module.export = {
	optimizations: {
		concatenateModules: false
	},
    plugins: [
        new Foo(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

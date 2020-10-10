module.export = {
	optimizations: {
		namedModules: false
	},
    plugins: [
        new Foo(),
        new webpack.NamedModulesPlugin()
    ]
}

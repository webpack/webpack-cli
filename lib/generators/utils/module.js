module.exports = () => {
	return {
		test: new RegExp(/\.js$/),
		exclude: "/node_modules/",
		loader: "'babel-loader'",
		options: {
			presets: ["'es2015'"]
		}
	};
};

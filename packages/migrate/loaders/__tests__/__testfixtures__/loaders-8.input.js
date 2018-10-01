module.exports = {
	module: {
		loaders: [
			{
				include: path.join(__dirname, "src"),
				loaders: ["style", "css?modules&importLoaders=1&string=test123"],
				test: /\.js$/
			}
		]
	}
};

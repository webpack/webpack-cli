module.exports = {
	module: {
		rules: [
			{
				test: /\.json/,
				use: [
					{
						loader: "json-loader"
					}
				]
			}
		]
	}
};

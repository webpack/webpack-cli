module.exports = {
  module: {
	loaders: [
		{
		loaders: [
			{
			loader: "style",
			},
			{
			loader: "css",
			query: {
				modules: true,
			},
			},
		],
		test: /\.css$/,
		},
	],
  },
};

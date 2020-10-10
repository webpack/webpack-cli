module.exports = {
  module: {
	loaders: [
		{
		loader: "style!css?modules&importLoaders=1&string=test123",
		test: /\.css$/,
		},
	],
  },
};

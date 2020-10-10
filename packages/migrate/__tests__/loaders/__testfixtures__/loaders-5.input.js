module.exports = {
  module: {
	loaders: [
		{
		loader: "babel-loader",
		test: /\.js$/,
		},
	],

	preLoaders: [
		{
		loader: "eslint-loader",
		test: /\.js$/,
		},
	],
  },
};

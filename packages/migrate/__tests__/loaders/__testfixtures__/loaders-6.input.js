module.exports = {
  module: {
	loaders: [
		{
		loader: "babel-loader",
		test: /\.js$/,
		},
	],
	postLoaders: [
		{
		loader: "my-post-loader",
		test: /\.js$/,
		},
	],
  },
};

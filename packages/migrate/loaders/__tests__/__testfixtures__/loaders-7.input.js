module.exports = {
  module: {
	loaders: [
		{
		exclude: /(node_modules)/,
		loader: "babel-loader",
		query: {
			presets: ["env"],
		},
		test: /\.js$/,
		},
	],
  },
};

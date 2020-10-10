module.exports = {
  module: {
	loaders: [
		{
		loader: "url-loader",
		options: {
			limit: 10000,
			name: "static/media/[name].[hash:8].[ext]",
		},
		test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
		},
	],
  },
};

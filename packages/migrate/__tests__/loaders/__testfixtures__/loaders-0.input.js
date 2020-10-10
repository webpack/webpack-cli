module.exports = [
  {
	module: {
		loaders: [
		{
			loader: "babel",
			test: /\.js$/,
		},
		],
	},
  },
  {
	module: {
		loaders: [
		{
			loader: "style!css?modules&importLoaders=1&string=test123",
			test: /\.css$/,
		},
		],
	},
  },
  {
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
  },
  {
	module: {
		preLoaders: [
		{
			loader: "eslint",
			test: /\.js$/,
		},
		],
	},
  },
  {
	module: {
		postLoaders: [
		{
			loader: "my-post",
			test: /\.js$/,
		},
		],
	},
  },
  {
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
  },
  {
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
  },
];

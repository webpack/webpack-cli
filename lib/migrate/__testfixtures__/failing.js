const webpack = require("webpack");
const nodeEnvironment = process.env.NODE_ENV;
const _ = require("lodash");

const config = {
	entry: {
		lib: "./app/index.js",
		email: "./app/email.js"
	},
	plugins: [
		new webpack.DefinePlugin({
			INCLUDE_ALL_MODULES: function includeAllModulesGlobalFn(modulesArray, application) {
				modulesArray.forEach(function executeModuleIncludesFn(moduleFn) {
					moduleFn(application);
				});
			},
			ENVIRONMENT: JSON.stringify(nodeEnvironment)
		})
	],
	output: {
		path: __dirname + "/app",
		filename: "bundle.js"
	},
	resolve: {
		root: __dirname + "/app"
	},
	module: {
		// preLoaders: [
		//   { test: /\.js?$/, loader: 'eslint', exclude: /node_modules/ }
		// ],
		loaders: [
			{ test: /\.js$/, exclude: /(node_modules)/, loader: "babel" },
			{ test: /\.html/, exclude: [/(node_modules)/, /src\/index\.html/], loader: "html-loader" },
			{ test: /\.s?css$/, loader: "style!css!sass" },
			{ test: /\.(png|jpg)$/, loader: "url-loader?mimetype=image/png" }
		]
	},
	// extra configuration options.
	// eslint: {
	//   configFile: '.eslintrc.js'
	// }
};

switch (nodeEnvironment) {
	case "production":
		config.plugins.push(new webpack.optimize.UglifyJsPlugin());
	case "preproduction":
		config.output.path = __dirname + "/dist";
		config.plugins.push(new webpack.optimize.DedupePlugin());
		config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

		config.output.filename = "[name].js";

		config.entry = {
			lib: ["./app/index.js", "angular", "lodash"],
			email: ["./app/email.js", "angular"]
		};

		config.devtool = "source-map";
		config.output.libraryTarget = "commonjs2";
		break;

	case "test":
		config.entry = "./index.js";
		break;

	case "development":
		config.entry = {
			lib: ["./app/index.js", "webpack/hot/dev-server"],
			email: ["./app/email.js", "webpack/hot/dev-server"]
		};
		config.output.filename = "[name].js";
		config.devtool = "source-map";
		break;

	default:
		console.warn("Unknown or Undefined Node Environment. Please refer to package.json for available build commands.");
}

module.exports = config;

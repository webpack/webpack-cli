// This should throw
const webpack = require("webpack");

const inst = new webpack.optimize.OccurrenceOrderPlugin();
module.exports = config => {
	config.plugins = [inst];
	return config;
};

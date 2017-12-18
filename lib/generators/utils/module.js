"use strict";

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
module.exports = () => {
	return {
		test: new RegExp(/\.js$/),
		exclude: "/node_modules/",
		loader: "'babel-loader'",
		options: {
			presets: ["'env'"]
		}
	};
};

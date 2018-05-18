"use strict";

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @param {Void} _ - void value
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
module.exports = _ => {
	return {
		test: `${new RegExp(/\.js$/)}`,
		include: ["path.resolve(__dirname, 'src')"],
		loader: "'babel-loader'",
		options: {
			presets: ["'env'", {
				modules: false
			}],
			plugins: ["'syntax-dynamic-import'"]
		}
	};
};

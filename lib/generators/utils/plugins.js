"use strict";

/**
 *
 * Callable function with the initial plugins
 *
 * @param {Void} _ - void value
 * @returns {Function} An function that returns an array
 * that consists of the uglify plugin
 */

module.exports = _ => {
	return ["new UglifyJSPlugin()"];
};

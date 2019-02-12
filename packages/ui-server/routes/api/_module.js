/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
module.exports = function() {
	return {
		include: ["path.resolve(__dirname, 'src')"],
		loader: "'babel-loader'",
		options: {
			plugins: [
				"'syntax-dynamic-import'",
			],
			presets: [
				[
					"'env'",
					{
						"'modules'": false,
					},
				],
			],
		},
		test: `${new RegExp(/\.js$/)}`,
	};
};

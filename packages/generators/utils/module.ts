interface IModule extends Object {
	include: string[];
	loader: string;
	options: {
		plugins: string[];
		presets: Array<Array<string | object>>;
	};
	test: string;
}

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
export default function(): IModule {
	return {
		include: ["path.resolve(__dirname, 'src')"],
		loader: "'babel-loader'",
		options: {
			plugins: [
				"'syntax-dynamic-import'",
			],
			presets: [
				[
					"'@babel/preset-env'",
					{
						"'modules'": false,
					},
				],
			],
		},
		test: `${new RegExp(/\.js$/)}`,
	};
}

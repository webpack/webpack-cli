interface Module extends Object {
	include: string[];
	loader: string;
	options: {
		plugins: string[];
		presets: Preset[][];
	};
	test: string;
}

type Preset = string | object;

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
export default function(): Module {
	return {
		include: ["path.resolve(__dirname, 'src')"],
		loader: "'babel-loader'",
		options: {
			plugins: ["'syntax-dynamic-import'"],
			presets: [
				[
					"'@babel/preset-env'",
					{
						"'modules'": false
					}
				]
			]
		},
		test: `${new RegExp(/\.js$/)}`
	};
}

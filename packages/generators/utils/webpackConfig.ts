import { WebpackOptions } from "../types";

export function getDefaultOptimization(usingDefaults: boolean): WebpackOptions["optimization"] {
	let optimizationOptions;
	if (!usingDefaults) {
		optimizationOptions = {
			minimizer: ["new TerserPlugin()"],
			splitChunks: {
				cacheGroups: {
					vendors: {
						priority: -10,
						test: "/[\\\\/]node_modules[\\\\/]/"
					}
				},
				chunks: "'async'",
				minChunks: 1,
				minSize: 30000,
				name: !usingDefaults
			}
		};
	} else {
		optimizationOptions = {
			minimizer: ["new TerserPlugin()"],
			splitChunks: {
				chunks: "'all'"
			}
		};
	}
	return optimizationOptions;
}

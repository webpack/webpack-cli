/**
 *
 * Callable function with the initial plugins
 *
 * @returns {Function} An function that returns an array
 * that consists of terser-webpack-plugin
 */

export default function(): string[] {
	return ["new TerserPlugin()"];
}

/**
 *
 * Callable function with the initial plugins
 *
 * @returns {Function} An function that returns an array
 * that consists of the terser plugin
 */

export default function(_?: void): string[] {
	return ["new TerserPlugin()"];
}

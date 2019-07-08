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

/**
 *
 * Replaces the string with a substring at the given index
 * https://gist.github.com/efenacigiray/9367920
 *
 * @param	{String} str - string to be modified
 * @param	{Number} index - index to replace from
 * @param	{String} replace - string to replace starting from index
 *
 * @returns	{String} string - The newly mutated string
 *
 */

export const replaceAt = (str: string, index: number, replace: string): string => {
	return str.substring(0, index) + replace + str.substring(index + 1);
};

/**
 *
 * Generate a webpack standard webpack plugin name from the plugin name from the Answer
 *
 * @param	{String} rawPluginName - plugin name from answer
 *
 * @returns	{String} string - the webpack standard plugin name
 *
 */

export const generatePluginName = (rawPluginName: string): string => {
	let myPluginNameArray: string[];
	myPluginNameArray = rawPluginName.split("-");
	const pluginArrLength: number = myPluginNameArray.length;
	for (let i = 0; i < pluginArrLength && pluginArrLength > 1; i++) {
		myPluginNameArray[i] = replaceAt(myPluginNameArray[i], 0, myPluginNameArray[i].charAt(0).toUpperCase());
	}
	return myPluginNameArray.join("");
};

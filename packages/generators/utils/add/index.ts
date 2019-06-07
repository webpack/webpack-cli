import PROP_TYPES from "@webpack-cli/utils/prop-types";

export const PROPS: string[] = Array.from(PROP_TYPES.keys());

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
export function replaceAt(str: string, index: number, replace: string): string {
	return str.substring(0, index) + replace + str.substring(index + 1);
}

/**
 *
 * Checks if the given array has a given property
 *
 * @param	{Array} arr - array to check
 * @param	{String} prop - property to check existence of
 *
 * @returns	{Boolean} hasProp - Boolean indicating if the property
 * is present
 */
export const traverseAndGetProperties = (arr: object[], prop: string): boolean => {
	let hasProp = false;
	arr.forEach((p: object): void => {
		if (p[prop]) {
			hasProp = true;
		}
	});
	return hasProp;
};

/**
 *
 * Search config properties
 *
 * @param {Object} answers	Prompt answers object
 * @param {String} input	Input search string
 *
 * @returns {Promise} Returns promise which resolves to filtered props
 *
 */
export const searchProps = (answers: object, input: string): Promise<string[]> => {
	input = input || "";
	return Promise.resolve(PROPS.filter((prop: string): boolean => prop.toLowerCase().includes(input.toLowerCase())));
};

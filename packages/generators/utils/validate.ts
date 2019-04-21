/**
 *
 * Validates an input to check if an input is provided
 *
 * @param {String} value - The input string to validate
 * @returns {String | Boolean } Returns truthy if its long enough
 * Or a string if the user hasn't written anything
 */
export default function validate(value: string): string | boolean {
	if (value.length) {
		return true;
	}

	return "Please specify an answer!";
}

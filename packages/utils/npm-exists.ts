import * as got from "got";

// TODO: to understand the type
// eslint-disable-next-line
const constant = (value: boolean) => (res: got.Response<string>): boolean | PromiseLike<boolean> => value;

/**
 *
 * Checks if the given dependency/module is registered on npm
 *
 * @param {String} moduleName - The dependency to be checked
 * @returns {Promise} constant - Returns either true or false,
 * based on if it exists or not
 */

// TODO: figure out the correct type here
// eslint-disable-next-line
export default function npmExists(moduleName: string): Promise<any> {
	const hostname = "https://www.npmjs.org";
	const pkgUrl = `${hostname}/package/${moduleName}`;
	return got(pkgUrl, {
		method: "HEAD"
	})
		.then(constant(true))
		.catch(constant(false));
}

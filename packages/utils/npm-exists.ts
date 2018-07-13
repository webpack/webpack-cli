import * as got from "got";

const constant = (value: boolean) => (res: got.Response<string>): boolean | PromiseLike<boolean> => value;

/**
 *
 * Checks if the given dependency/module is registered on npm
 *
 * @param {String} moduleName - The dependency to be checked
 * @returns {Promise} constant - Returns either true or false,
 * based on if it exists or not
 */

export default function npmExists(moduleName: string): Promise<any> {
	const hostname: string = "https://www.npmjs.org";
	const pkgUrl: string = `${hostname}/package/${moduleName}`;
	return got(pkgUrl, {
		method: "HEAD",
	})
		.then(constant(true))
		.catch(constant(false));
}

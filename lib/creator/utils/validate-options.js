"use strict";

const fs = require("fs");
const path = require("path");

/*
* @function getPath
*
* Finds the current filepath of a given string
*
* @param { String } part - The name of the file to be checked.
* @returns { String } - returns an string with the filepath
*/

function getPath(part) {
	return path.join(process.cwd(), part);
}

/*
* @function validateOptions
*
* Validates the options passed from an inquirer instance to make
* sure the path supplied exists
*
* @param { String } part - The name of the file to be checked.
* @returns { <Error|noop> } part - checks if the path exists or throws an error
*/

module.exports = function validateOptions(opts) {
	return Object.keys(opts).forEach(location => {
		let part = getPath(opts[location]);
		try {
			fs.readFileSync(part);
		} catch (err) {
			console.error("Found no file at:", part);
			process.exitCode = 1;
		}
	});
};

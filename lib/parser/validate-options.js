const fs = require('fs');
const path = require('path');

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
	return Object.keys(opts).forEach( (location) => {
		let part = getPath(opts[location]);
		try {
			fs.readFileSync(part);
		} catch (err) {
			console.error('Found no file at:', part);
			process.exit(1);
		}
	});
};
/*

const fs = require('fs');
const path = require('path');
const Rx = require('rxjs');

function getPath(part) {
	return path.join(process.cwd(), part);
}

const readFileObservable = Rx.Observable.bindNodeCallback(fs.readFileSync);

module.exports = function validateOptions(opts) {
	return Rx.Observable.pairs(opts)
	.map(([, opt]) => getPath(opt))
	.flatMap(part => readFileObservable(part))
	.then(part, err => {
		console.error('Found no file at:', part);
	});
};

*/

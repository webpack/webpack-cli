const npmExists = require("./npm-exists");
const resolvePackages = require("./resolve-packages");

/*
 * @function npmPackagesExists
 *
 * Loops through an array and checks if a package is registered
 * on npm and throws an error if it is not from @checkEachPackage
 *
 * @param { Array <String> } pkg - Array of packages to check existence of
 * @returns { Array } resolvePackages - Returns an process to install the pkg
 */

module.exports = function npmPackagesExists(addons) {
	return addons.map(pkg => checkEachPackage(pkg));
};

/*
 * @function checkEachPackage
 *
 * Checks if a package is registered on npm and throws if it is not
 *
 * @param { Object } pkg - pkg to check existence of
 * @returns { <Function|Error> } resolvePackages - Returns an process to install the pkg
 */

function checkEachPackage(pkg) {
	return npmExists(pkg).then((moduleExists) => {
		if(!moduleExists) {
			Error.stackTraceLimit = 0;
			throw new TypeError("Package isn't registered on npm.");
		}
		if(moduleExists) {
			return resolvePackages(pkg);
		}
	}).catch(err => {
		console.error(err.stack || err);
		process.exit(0);
	});
}

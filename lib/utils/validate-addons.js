const exists = require('./npm-exists');
const resolvePackages = require('./resolve-packages');

/*
* @function validateAddons
*
* Checks if a package is registered on npm and throws if it is not
*
* @param { Array } addons - packages included when running the init command
* @returns { <Function|Error> } resolvePackages - Returns a call to the addon
*/

module.exports = function validateAddons(addons) {
	Error.stackTraceLimit = 4;
	return addons.map( pkg => {
		//eslint-disable-next-line
		exists(pkg).then( (moduleExists) => {
			if(!moduleExists) {
				Error.stackTraceLimit = 0;
				throw new TypeError('Package isn\'t registered on npm.');
			}
			if (moduleExists) {
				return resolvePackages(pkg);
			}
		}).catch(err => {
			console.error(err.stack || err);
			process.exit(0);
		});
	});
};

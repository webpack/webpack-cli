const exists = require('./npm-exists');
const resolvePackages = require('./resolve-packages');
const chalk = require('chalk');

module.exports = function validateAddons(addon) {
	Error.stackTraceLimit = 4;
	return addon.map( pkg => {
		//eslint-disable-next-line
		exists(pkg).then( (moduleExists) => {
			!moduleExists ? (Error.stackTraceLimit = 0) : (Error.stackTraceLimit = 30);
			if(!moduleExists) {
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

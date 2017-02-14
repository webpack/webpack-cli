const exists = require('./npm-exists');
const resolvePackages = require('./resolve-packages');
const chalk = require('chalk');

module.exports = function validateAddons(addon) {
	Error.stackTraceLimit = 4;
	return addon.filter( pkg => {
		//eslint-disable-next-line
		if(pkg.length <= 14 || pkg.slice(0,14) !== 'webpack-addons') {
			throw new TypeError(chalk.bold(`${pkg} isn\'t a valid name.\n`) +
			chalk.red('\nIt should be prefixed with \'webpack-addons\', but have different suffix.\n'));
		}
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

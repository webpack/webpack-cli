const exists = require('./npm-exists');
const parse = require('../parser/index');

module.exports = function validateAddons(addon) {
	Error.stackTraceLimit = 3;
	return addon.filter( pkg => {
		if(pkg.slice(0,13) !== 'webpack-addon') {
			throw new TypeError('Package isn\'t a valid name\n' +
			'It should be prefixed with \'webpack-addon\'');
		} else if(pkg.length == 13 && pkg.slice(0,13) === 'webpack-addon') {
			throw new TypeError('\'webpack-addon\' is not a valid addon');
		}
		exists(pkg).then( (moduleExists) => {
			!moduleExists ? (Error.stackTraceLimit = 0) : (Error.stackTraceLimit = 30);
			if(!moduleExists) {
				throw new TypeError('Package isn\'t registered on npm.');
			}
			if (moduleExists) parse(addon, null);
		}).catch(err => {
			console.error(err.stack || err);
			process.exit(0);
		});
	});
};

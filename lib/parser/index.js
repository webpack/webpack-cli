const resolvePackages = require('./resolve-packages');
const resolveTransform = require('./resolve-transform');
//eslint-disable-next-line
const validateOptions = require('./validateOptions');

module.exports = function parser(pkg,opts) {
	let opt = {
		packages: pkg,
		webpackOptions: opts || null
	};
	if(opt.webpackOptions) validateOptions(opts);
	return (!opts ? resolvePackages(opt) : resolveTransform())
};

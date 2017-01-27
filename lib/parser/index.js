const resolvePackages = require('./resolve-packages');
const resolveTransform = require('./resolve-transform');
//eslint-disable-next-line
const validateOptions = require('./validateOptions');

module.exports = function parser(pkg,opts) {
	// null, config -> without package
	// addon, null -> with package
	if(opts) {
		validateOptions(opts);
	} else if(!opts) {
		resolvePackages(pkg);
	} else {
		resolveTransform();
	}
};

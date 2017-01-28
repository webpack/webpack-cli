const resolveTransform = require('./resolve-transform');
const validateOptions = require('./validateOptions');

module.exports = function parser(pkg,opts) {
	// null, config -> without package
	// addon, null -> with package
	console.log(pkg, opts, 'Hey!');
	if(opts) {
		validateOptions(opts);
	} else {
		resolveTransform(pkg, opts);
	}
};

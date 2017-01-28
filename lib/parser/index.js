const resolveTransform = require('./resolve-transform');
const validateOptions = require('./validateOptions');

//TODO: Allow options and pkg to be passed down.
module.exports = function parser(pkg,opts) {
	// null, config -> without package
	// addon, null -> with package
	console.log(pkg, opts, 'Hello');
	if(opts) {
		validateOptions(opts);
	} else {
		resolveTransform();
	}
};

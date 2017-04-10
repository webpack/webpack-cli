/* eslint-disable */
const jscodeshift = require('jscodeshift');

// moving to webpack-addons later
module.exports = function(value) {
	return jscodeshift("() => " +  "'" + value + "'");
}

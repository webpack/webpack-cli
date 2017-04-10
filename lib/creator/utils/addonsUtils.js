/* eslint-disable */
const jscodeshift = require('jscodeshift');

// moving to webpack-addons later
function arrowFunction(value) {
	return jscodeshift("() => " +  "'" + value + "'");
};
function regularFunction(value, funcName) {
	return jscodeshift("function " + funcName + "() {\n return " +  "'" + value + "'" + "\n}");
};
function dynamicPromise(arr) {
	if(Array.isArray(arr)) {
		return jscodeshift("() => new Promise((resolve) => resolve([" + arr.map( (n) => {
			return "'" + n + "'"
		}) + "]))");
	} else {
		return jscodeshift("() => new Promise((resolve) => resolve(" + "'" + arr + "'" + "))");
	}
};
function assetFilterFunction(value) {
	return jscodeshift("function assetFilter" + "(assetFilename) {\n return assetFilename.endsWith(" +  "'" + "." + value + "'" + ");\n}");
};

module.exports = {
	arrowFunction,
	dynamicPromise,
	regularFunction,
	assetFilterFunction
};

/* eslint-disable */
const jscodeshift = require('jscodeshift');

// moving to webpack-addons later
function arrowFunction(value) {
	return jscodeshift("() => " +  "'" + value + "'");
};
function regularFunction(value, funcName) {
	return jscodeshift("function " + funcName + "() {\n return " + value + "\n}");
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
function externalRegExp(regexp) {
	return jscodeshift("\n function externalRegExp(context, request, callback) {\n if ("
	+ "/" + regexp + "/.test(request)){" + "\n" + "   return callback(null, 'commonjs ' + request);\n}\n"
	+ "callback();\n}")
};
function pureRegExp(regexp) {
	return jscodeshift(regexp)
};
function moduleRegExp(regexp) {
	return jscodeshift(`\\${regexp}`)
}
function commonChunksPluginCreate(value) {
	return jscodeshift("new webpack.optimize.CommonsChunkPlugin({name:" + "'" + value + "'" + ",filename:" + "'" + value + "-[hash].min.js'})")
}
function createPathProperty(one,two,three) {
	return jscodeshift(one + '(' + two + ", '" + three + "')")
}

function createRequire(val) {
 return jscodeshift("const " + val + " = " + "require(" + "'" + val + "'" + ");")
}
function createObject(obj) {
	return jscodeshift(obj)
}
module.exports = {
	arrowFunction,
	dynamicPromise,
	regularFunction,
	assetFilterFunction,
	externalRegExp,
	pureRegExp,
	commonChunksPluginCreate,
	createPathProperty,
	createRequire,
	createObject,
	moduleRegExp
};

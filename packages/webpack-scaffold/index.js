const jscodeshift = require("jscodeshift");

function createArrowFunction(value) {
	return `() => '${value}'`;
}

function createRegularFunction(value) {
	return `function () {\n return '${value}'\n}`;
}

function createDynamicPromise(arr) {
	if (Array.isArray(arr)) {
		return (
			"() => new Promise((resolve) => resolve([" +
			arr.map(n => {
				return "'" + n + "'";
			}) +
			"]))"
		);
	} else {
		return "() => new Promise((resolve) => resolve(" + "'" + arr + "'" + "))";
	}
}

function createAssetFilterFunction(value) {
	return `function (assetFilename) {\n return assetFilename.endsWith('.${value}');\n}`;
}

function createExternalFunction(regexp) {
	return (
		"\n function (context, request, callback) {\n if (" +
		"/" +
		regexp +
		"/.test(request)){" +
		"\n" +
		"   return callback(null, 'commonjs' + request);\n}\n" +
		"callback();\n}"
	);
}

function parseValue(regexp) {
	return jscodeshift(regexp);
}

function createRequire(val) {
	return `const ${val} = require('${val}');`;
}

function List(name, message, choices) {
	return {
		type: "list",
		name,
		message,
		choices
	};
}

function RawList(name, message, choices) {
	return {
		type: "rawlist",
		name,
		message,
		choices
	};
}

function CheckList(name, message, choices) {
	return {
		type: "checkbox",
		name,
		message,
		choices
	};
}

function Input(name, message) {
	return {
		type: "input",
		name,
		message
	};
}

function InputValidate(name, message, cb) {
	return {
		type: "input",
		name,
		message,
		validate: cb
	};
}

function Confirm(name, message) {
	return {
		type: "confirm",
		name,
		message
	};
}

module.exports = {
	createArrowFunction,
	createDynamicPromise,
	createRegularFunction,
	createAssetFilterFunction,
	createExternalFunction,
	parseValue,
	createRequire,
	List,
	RawList,
	CheckList,
	Input,
	InputValidate,
	Confirm
};

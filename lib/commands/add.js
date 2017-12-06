module.exports = function(type, args) {
	const PROP_TYPES = new Set(
		"context",
		"devServer",
		"devtool",
		"entry",
		"external",
		"module",
		"node",
		"output",
		"performance",
		"plugin",
		"resolve",
		"target",
		"watch"
	);
	if (!PROP_TYPES.has(type)) {
		throw new Error(`${type} isn't a valid property in webpack`);
	}
	// TODO:
	// 1.read file
	// ask user what he/she wants to perform ( i.e ask for names etc)
	// 2. get config prop if it has any
	// 3. add config prop if it doesn't
	// write and output
	// console.log("hey", type, args, "Ho");
};

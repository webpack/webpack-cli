const {
	Input,
	Confirm,
	List
} = require("@webpack-cli/webpack-scaffold");
module.exports = [
	Input(
		"entry",
		"What is the entry point in your app?"
	),
	Confirm("splitChunks", "Want splitChunks in optimization? "),
	List(
		"splitChunkType",
		"What do you want the type of  splitChunkName i.e chunks=?( Not aplicable if the above question is false)",
		["all", "async", "initial"]
	),
	Confirm(
		"context",
		"Want context ? "
	),
	Input(
		"contextPath",
		"Please Enter the context absolute path ( Not aplicable if the above question is false)"
	),
	Input(
		"configName",
		"Please Enter the Config Name"
	)
];

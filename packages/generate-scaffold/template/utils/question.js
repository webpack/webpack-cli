const {
	Input,
	Confirm
} = require("@webpack-cli/webpack-scaffold");
module.exports = [
	Input("entry", "What is the entry point in your app?"),
	Confirm("commonChunks", "Want CommonChunks ? "),
	Input("plugin", "What do you want to name your commonsChunk?( Not aplicable if the above question is false)"),
	Confirm("context", "Want context ? "),
	Input("contextPath", "Please Enter the context absolute path ( Not aplicable if the above question is false)"),
	Input("configName", "Please Enter the Config Name")
];

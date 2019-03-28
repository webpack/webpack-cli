const createCommonsChunkPlugin = require("@webpack-cli/webpack-scaffold").commonChunksPluginCreate;
module.exports = function createDevConfig(answer) {

	let entryProp = answer.entry ? ("'" + answer.entry + "'") : "'index.js'";
	return {
		entry: entryProp,
		output: {
			filename: "'[name].js'"
		},
		context: answer.context ? `path.join(__dirname,'${answer.contextPath}')` : "",
		plugins: answer.commonChunks ? [
			createCommonsChunkPlugin(answer.plugin)
		] : []
	};

};

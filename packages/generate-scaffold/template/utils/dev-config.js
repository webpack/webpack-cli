const createSplitChunkOptimization = require("./split-chunks");
module.exports = function createDevConfig(answer) {

	const entryProp = answer.entry ? ("'" + answer.entry + "'") : "'index.js'";
	return {
		entry: entryProp,
		output: {
			filename: "'[name].js'"
		},
		context: answer.context ? `path.join(__dirname,'${answer.contextPath}')` : "",
		optimization: answer.splitChunks ? [
			createSplitChunkOptimization(answer.splitChunkType)
		] : []
	};

};

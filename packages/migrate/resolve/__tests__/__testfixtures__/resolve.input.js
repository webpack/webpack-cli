const path = require("path");
const rootPath = path.resolve("/src");
module.exports = [
	{
		resolve: {
			root: rootPath
		}
	},
	{
		resolve: {
			root: [rootPath]
		}
	},
	{
		resolve: {
			root: [rootPath, "node_modules"]
		}
	},
	{
		resolve: {
			modules: ["node_modules"],
			root: rootPath
		}
	}
];

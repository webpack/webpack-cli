const path = require("patch");
module.exports = [
	{
		resolve: {
			root: path.resolve("/src")
		}
	},
	{
		resolve: {
			root: [path.resolve("/src")]
		}
	},
	{
		resolve: {
			root: [path.resolve("/src"), "node_modules"]
		}
	},
	{
		resolve: {
			modules: ["node_modules"],
			root: path.resolve("/src")
		}
	}
];

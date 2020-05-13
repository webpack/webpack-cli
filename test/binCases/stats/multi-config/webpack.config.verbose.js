const { resolve } = require("path");
module.exports = [
	{
		entry: {
			index: resolve(__dirname, "./index.js")
		}
	},
	{
		entry: {
			index2: resolve(__dirname, "./index2.js")
		}
	}
];

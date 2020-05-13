const { resolve } = require("path");
module.exports = [
	{
		entry: resolve(__dirname, "./index.js")
	},
	{ entry: resolve(__dirname, "./index2.js") }
]

"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"performance",
	"performance-0",
	{
		hints: "'warning'",
		maxEntrypointSize: 400000,
		maxAssetSize: 100000,
		assetFilter:
			"function(assetFilename) {" +
			"return assetFilename.endsWith('.js');" +
			"}"
	},
	"init"
);

defineTest(
	__dirname,
	"performance",
	"performance-1",
	{
		hints: "'nuclear-warning'",
		maxAssetSize: 6969,
		assetFilter:
			"un(assetFilename) {" + "return assetFilename.endsWith('.js');" + "}"
	},
	"add"
);

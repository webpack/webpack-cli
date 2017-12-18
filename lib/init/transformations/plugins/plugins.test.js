"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"plugins",
	"plugins-0",
	[
		"new webpack.optimize.CommonsChunkPlugin({name:" +
			"'" +
			"vendor" +
			"'" +
			",filename:" +
			"'" +
			"vendor" +
			"-[hash].min.js'})"
	],
	"init"
);

defineTest(
	__dirname,
	"plugins",
	"plugins-1",
	"new webpack.optimize.DefinePlugin()",
	"add"
);

defineTest(
	__dirname,
	"plugins",
	"plugins-0",
	"new webpack.optimize.DefinePlugin()",
	"add"
);

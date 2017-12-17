"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "externals", "externals-0", /react/, "init");
defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "'react'"
	},
	"init"
);

defineTest(__dirname, "externals", "externals-1", "myObj", "init");

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "reactObj"
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: ["reactObj", "path.join(__dirname, 'app')", "'jquery'"]
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "'lodash'",
			amd: "'lodash'",
			root: "'_'"
		}
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "lodash",
			amd: "hidash",
			root: "_"
		}
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		{
			a: "false",
			b: "true",
			"'./ext'": "./hey"
		},
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		"myObj",
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"init"
);
/*
defineTest(__dirname, "externals", "externals-0", /react/, "add");
defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'qQuery'",
		react: "'isNowPreact'"
	},
	"add"
);

defineTest(__dirname, "externals", "externals-1", "myObj", "add");

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "reactObj"
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: ["reactObj", "path.join(__dirname, 'app')", "'jquery'"]
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-2",
	{
		highdash: {
			commonjs: "'highdash'",
			amd: "'lodash'",
			root: "'_'"
		}
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "lodash",
			amd: "hidash",
			root: "_"
		}
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		{
			a: "false",
			b: "true",
			"'./ext'": "./hey"
		},
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		"myObj",
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"add"
);
*/

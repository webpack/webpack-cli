"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"resolveLoader",
	"resolveLoader-0",
	{
		modules: ["'ok'", "mode_nodules"],
		mainFields: ["no", "'main'"],
		moduleExtensions: ["'-kn'", "ok"]
	},
	"init"
);

defineTest(
	__dirname,
	"resolveLoader",
	"resolveLoader-1",
	{
		modules: ["'ok'", "mode_nodules"],
		mainFields: ["no", "'main'"],
		moduleExtensions: ["'-kn'", "ok"]
	},
	"add"
);

"use strict";

const defineTest = require("../../../utils/defineTest");
const jscodeshift = require("jscodeshift");

defineTest(
	__dirname,
	"output",
	"output-0",
	{
		filename: "'bundle'",
		path: "'dist/assets'",
		pathinfo: true,
		publicPath: "'https://google.com'",
		sourceMapFilename: "'[name].map'",
		sourcePrefix: jscodeshift("'\t'"),
		umdNamedDefine: true,
		strictModuleExceptionHandling: true
	},
	"init"
);

defineTest(
	__dirname,
	"output",
	"output-1",
	{
		filename: "'app'",
		path: "'distro/src'",
		pathinfo: false,
		publicPath: "'https://google.com'",
		sourcePrefix: jscodeshift("'\t'")
	},
	"add"
);

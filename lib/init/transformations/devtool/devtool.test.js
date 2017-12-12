"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "devtool", "devtool-0", "'source-map'", "init");
defineTest(__dirname, "devtool", "devtool-0", "myVariable", "init");
defineTest(
	__dirname,
	"devtool",
	"devtool-1",
	"'cheap-module-source-map'",
	"init"
);
defineTest(__dirname, "devtool", "devtool-1", "false", "init");

"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"devServer",
	"devServer-0",
	{
		contentBase: "path.join(__dirname, 'dist')",
		compress: true,
		port: 9000
	},
	"init"
);
defineTest(__dirname, "devServer", "devServer-1", "someVar", "init");

defineTest(
	__dirname,
	"devServer",
	"devServer-2",
	{
		contentBase: "path.join(__dirname, 'dist')",
		compress: true,
		port: 9000
	},
	"add"
);

defineTest(
	__dirname,
	"devServer",
	"devServer-3",
	{
		contentBase: "path.join(__dirname, 'dist')",
		port: 420
	},
	"add"
);

defineTest(__dirname, "devServer", "devServer-4", "someVar", "add");

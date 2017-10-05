"use strict";

const defineTest = require("../../../transformations/defineTest");

defineTest(__dirname, "devServer", "devServer-0",{
	contentBase: "path.join(__dirname, 'dist')",
	compress: true,
	port: 9000
});
defineTest(__dirname, "devServer", "devServer-1", "someVar");

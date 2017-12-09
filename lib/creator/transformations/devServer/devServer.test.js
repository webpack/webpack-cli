"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "devServer", "devServer-0", {
	contentBase: "path.join(__dirname, 'dist')",
	compress: true,
	port: 9000
});
defineTest(__dirname, "devServer", "devServer-1", "someVar");

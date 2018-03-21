"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"optimization",
	"optimization-0",
	{
		splitChunks: {
			minSize: 1,
			chunks: "'all'"
		}
	},
	"init"
);

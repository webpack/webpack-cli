"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"amd",
	"other-0",
	{
		jQuery: true,
		kQuery: false
	},
	"init"
);
defineTest(__dirname, "bail", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", "cacheVal", "init");
defineTest(__dirname, "profile", "other-0", true, "init");
defineTest(__dirname, "merge", "other-0", "myConfig", "init");

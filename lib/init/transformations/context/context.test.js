"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"context",
	"context-0",
	"path.resolve(__dirname, 'app')",
	"init"
);
defineTest(__dirname, "context", "context-1", "'./some/fake/path'", "init");
defineTest(__dirname, "context", "context-2", "contextVariable", "init");

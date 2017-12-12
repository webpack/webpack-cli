"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "entry", "entry-0", "'index.js'", "init");
defineTest(__dirname, "entry", "entry-0", ["'index.js'", "'app.js'"], "init");
defineTest(__dirname, "entry", "entry-0", {
	index: "'index.js'",
	app: "'app.js'"
}, "init");

defineTest(__dirname, "entry", "entry-0", {
	inject: "something",
	app: "'app.js'",
	inject_1: "else"
}, "init");
defineTest(__dirname, "entry", "entry-0", "() => 'index.js'", "init");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	"() => new Promise((resolve) => resolve(['./app', './router']))", "init"
);
defineTest(__dirname, "entry", "entry-0", "entryStringVariable", "init");

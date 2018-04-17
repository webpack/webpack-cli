"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "entry", "entry-0", "'index.js'", "init");
defineTest(__dirname, "entry", "entry-0", "\"index.js\"", "init");
defineTest(__dirname, "entry", "entry-0", ["'index.js'", "'app.js'"], "init");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		index: "'index.js'",
		app: "'app.js'"
	},
	"init"
);

defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		inject: "something",
		app: "'app.js'",
		inject_1: "else"
	},
	"init"
);
defineTest(__dirname, "entry", "entry-0", "() => 'index.js'", "init");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	"() => new Promise((resolve) => resolve(['./app', './router']))",
	"init"
);
defineTest(__dirname, "entry", "entry-0", "entryStringVariable", "init");

defineTest(__dirname, "entry", "entry-0", "'index.js'", "add");
defineTest(__dirname, "entry", "entry-0", ["'index.js'", "'app.js'"], "add");
defineTest(
	__dirname,
	"entry",
	"entry-1",
	{
		index: "'outdex.js'",
		app: "'nap.js'"
	},
	"add"
);

defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		inject: "something",
		ed: "'eddy.js'",
		inject_1: "else"
	},
	"add"
);
defineTest(__dirname, "entry", "entry-1", "() => 'index.js'", "add");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	"() => new Promise((resolve) => resolve(['./app', './router']))",
	"add"
);
defineTest(__dirname, "entry", "entry-0", "entryStringVariable", "add");

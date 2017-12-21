"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"watchOptions",
	"watch-0",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-1",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-2",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-0",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"add"
);
defineTest(
	__dirname,
	"watchOptions",
	"watch-3",
	{
		poll: 69,
		ignored: "/node_modules/"
	},
	"add"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-3",
	{
		ignored: "abc"
	},
	"add"
);

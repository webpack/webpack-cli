"use strict";

const defineTest = require("./defineTest");

defineTest(
	__dirname,
	"init",
	"fixture-1",
	"entry",
	{
		objects: "are",
		super: [
			"yeah",
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			}
		],
		nice: "':)'",
		foo: "Promise.resolve()",
		man: "() => duper"
	}
);

// Tests for _add_ command
defineTest(
	__dirname,
	"entry",
	"fixture-2",
	{
		objects: "are",
		super: [
			"yeah",
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			}
		],
		nice: "':)'",
		foo: "Promise.resolve()",
		man: "() => duper"
	},
	"add"
);

defineTest(
	__dirname,
	"mode",
	"fixture-2",
	"'production'",
	"add"
);

defineTest(
	__dirname,
	"entry",
	"fixture-2",
	"'src/index.js'",
	"add"
);

defineTest(
	__dirname,
	"entry",
	"fixture-2",
	{
		a: "aaaa.js",
		b: "bbbb.js"
	},
	"add"
);

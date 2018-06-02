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

defineTest(
	__dirname,
	"add",
	"fixture-2",
	"entry",
	{
		objects: "are not",
		super: [
			"op",
			{
				test: new RegExp(/\.(wasm|c)$/),
				loader: "'pia-loader'",
				enforce: "'pre'",
				include: ["asd", "'Stringy'"],
				options: {
					formatter: "'nao'"
				}
			}
		],
		nice: "'=)'",
		foo: "Promise.resolve()",
		man: "() => nice!!",
		mode: "super-man"
	}
);

"use strict";

const defineTest = require("./defineTest");

defineTest(
	__dirname,
	"entry",
	"fixture-1",
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
		man: "() => duper"
	},
	"init"
);

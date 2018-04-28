"use strict";

const defineTest = require("../utils/defineTest");
const propTypes = require("../utils/prop-types");

defineTest(
	__dirname,
	propTypes[0],
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

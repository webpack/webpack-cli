"use strict";

const defineTest = require("../utils/defineTest");
const propTypes = require("../utils/prop-types");

propTypes.forEach(prop => {
	defineTest(
		__dirname,
		prop,
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
});

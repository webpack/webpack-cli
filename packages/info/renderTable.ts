import chalk from "chalk";
export function renderTable(data) {
	var Table = require("cli-table3");

	// instantiate
	var table = new Table({
		head: ["Name", "webpack.config.js"]
	});

	// table is an Array, so you can `push`, `unshift`, `splice` and friends
	data.map(elm => {
		table.push(elm);
	});

	console.log(table.toString());
}

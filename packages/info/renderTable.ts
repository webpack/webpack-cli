import { getNameFromPath } from "./configParser";
import chalk from "chalk";
export function renderTable(data, fileName) {
	const Table = require("cli-table3");

	// instantiate
	let table = new Table({
		head: ["Config", fileName]
	});

	// table is an Array, so you can `push`, `unshift`, `splice` and friends
	data.map(elm => {
		table.push(elm);
	});

	console.log(table.toString());
}

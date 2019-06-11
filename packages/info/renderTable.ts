import * as Table from "cli-table3";

export function renderTable(data, fileName): void {
	// instantiate
	let table = new Table({
		head: ["Config", fileName]
	});

	// table is an Array, so you can `push`, `unshift`, `splice` and friends
	data.map((elm: Table.Cell[] & Table.VerticalTableRow & Table.CrossTableRow): void => {
		table.push(elm);
	});

	console.log(table.toString());
	return;
}

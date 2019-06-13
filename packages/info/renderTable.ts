import * as Table from "cli-table3";

export function renderTable(data, fileName): string {
	let table = new Table({
		head: ["Config", fileName]
	});

	data.map((elm: Table.Cell[] & Table.VerticalTableRow & Table.CrossTableRow): void => {
		table.push(elm);
	});

	return table.toString();
}

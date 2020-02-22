import Table from "cli-table3";
import chalk from "chalk";
export function renderTable(data, fileName): string {
	const table = new Table({
		head: [chalk.blueBright("Config"), chalk.blueBright(fileName)]
	});

	data.map(
		(elm: Table.Cell[] & Table.VerticalTableRow & Table.CrossTableRow): void => {
			table.push(elm);
		}
	);

	return table.toString();
}

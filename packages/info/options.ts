import * as yargs from "yargs";
export const argv = yargs
	.option("system", {
		alias: "sys",
		demandOption: false,
		describe: "System information (OS, CPU)",
		type: "boolean",
	})
	.option("binaries", {
		alias: "bin",
		demandOption: false,
		describe: "Installed binaries",
		type: "boolean",
	})

	.option("browsers", {
		demandOption: false,
		describe: "Installed web browsers",
		type: "boolean",
	})
	.option("npmg", {
		demandOption: false,
		describe: "Globally installed NPM packages (webpack & webpack-cli only)",
		type: "boolean",
	})
	.option("npmPackages", {
		demandOption: false,
		describe: "Info about webpack installed in the project",
		type: "boolean",
	})
	.option("json", {
		demandOption: false,
		describe: "To get the output as JSON",
		type: "boolean",
	})
	.option("json", {
		demandOption: false,
		describe: "To get the output as JSON",
		type: "boolean",
	})
	.option("markdown", {
		demandOption: false,
		describe: "To get the output as markdown",
		type: "boolean",
	})
	.group(["json", "markdown"], `Output format`)
	.argv
	;

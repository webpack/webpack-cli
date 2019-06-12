import * as yargs from "yargs";
export const argv = yargs
	.option("system", {
		alias: "s",
		demandOption: false,
		describe: "System information (OS, CPU)",
		type: "boolean"
	})
	.option("binaries", {
		alias: "b",
		demandOption: false,
		describe: "Installed binaries (Node, yarn, npm)",
		type: "boolean"
	})

	.option("browsers", {
		demandOption: false,
		describe: "Installed web browsers",
		type: "boolean"
	})

	.option("npmg", {
		demandOption: false,
		describe: "Globally installed NPM packages (webpack & webpack-cli only)",
		type: "boolean"
	})
	.option("npmPackages", {
		demandOption: false,
		describe: "Info about packages related to webpack installed in the project",
		type: "boolean"
	})
	.option("output_json", {
		demandOption: false,
		describe: "To get the output as JSON",
		type: "boolean"
	})
	.option("output_markdown", {
		demandOption: false,
		describe: "To get the output as markdown",
		type: "boolean"
	})
	.group(["output-json", "output-markdown"], `Output format`).argv;

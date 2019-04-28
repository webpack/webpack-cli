import chalk from "chalk";
import * as envinfo from "envinfo";
import * as process from "process";
import { argv } from "./options";

import { AVAILABLE_COMMANDS, AVAILABLE_FORMATS, IGNORE_FLAGS } from "./commands";

const CONFIG = {};
const DEFAULT_DETAILS = {
	Binaries: ["Node", "Yarn", "npm"],
	Browsers: ["Chrome", "Firefox", "Safari"],
	System: ["OS", "CPU", "Memory"],
	npmGlobalPackages: ["webpack", "webpack-cli"],
	npmPackages: "*webpack*",
};
let DETAILS_OBJ = {};

export function informationType(type: string): object {
	switch (type) {
		case "system":
			return { System: ["OS", "CPU", "Memory"] };
		case "binaries":
			return { Binaries: ["Node", "Yarn", "npm"] };
		case "browsers":
			return { Browsers: ["Chrome", "Firefox", "Safari"] };
		case "npmg":
			return { npmGlobalPackages: ["webpack", "webpack-cli"] };
		case "npm":
			return { npmPackages: "*webpack*" };

	}
}

export default async function info(): Promise<void> {

	Object.keys(argv).forEach(async (flag): Promise<void> => {
		if (IGNORE_FLAGS.includes(flag)) {
			return;
		} else if (AVAILABLE_COMMANDS.includes(flag)) {
			const flagVal = informationType(flag);
			DETAILS_OBJ = { ...DETAILS_OBJ, ...flagVal };
		} else if (AVAILABLE_FORMATS.includes(flag)) {
			CONFIG[flag] = true;
		} else {
			// Invalid option
			process.stdout.write("\n" + chalk.bgRed(flag) + chalk.red(" is an invalid option"));
			return;

		}
	});

	process.stdout.write("\n" + await envinfo.run(
		Object.keys(DETAILS_OBJ).length ?
			DETAILS_OBJ : DEFAULT_DETAILS,
		CONFIG) +
		"\n");
}

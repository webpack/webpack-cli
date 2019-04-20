import * as envinfo from "envinfo";
import * as process from "process";
import { argv } from "./options"

import { AVAILABLE_COMMANDS, AVAILABLE_FORMATS, IGNORE_FLAGS } from "./commands";

const CONFIG = {}

export function informationType(type: string): object {
	switch (type) {
		case "system":
			return { System: ["OS", "CPU", "Memory"] };
			break;
		case "binaries":
			return { Binaries: ["Node", "Yarn", "npm"] };
			break;
		case "browsers":
			return { Browsers: ["Chrome", "Firefox", "Safari"] };
			break;
		case "npmGlobalPackages":
			return { npmGlobalPackages: ["webpack", "webpack-cli"] };
			break;
		case "npmPackages":
			return { npmPackages: "*webpack*" };
			break;
	}
}


export default async function info() {

	Object.keys(argv).forEach(async (flag) => {
		if (IGNORE_FLAGS.includes(flag)) {
			return;
		} else if (AVAILABLE_COMMANDS.includes(flag)) {
			const flagVal = informationType(flag);
			process.stdout.write(await envinfo.run(flagVal, CONFIG) + "\n");
		}
		else if (AVAILABLE_FORMATS.includes(flag)) {
			CONFIG[flag] = true
		}
	});
}

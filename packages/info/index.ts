import * as envinfo from "envinfo";
import * as process from "process";
import {argv} from "yargs";
/**
 * Prints debugging information for webpack issue reporting
 */

const AVAILABLE_FLAGS: string[] = ["binaries", "system", "browsers", "npmGlobalPackages", "npmPackages"];

export function informationType(type: string): object {
	switch (type) {
		case "binaries":
			return 	{Binaries: ["Node", "Yarn", "npm"]};
			break;
		case "system":
			return 	{System: ["OS", "CPU"]};
			break;
		case "browsers":
			return 	{Browsers: ["Chrome", "Firefox", "Safari"]};
			break;
		case "npmGlobalPackages":
			return 	{npmGlobalPackages: ["webpack", "webpack-cli"]};
			break;
		case "npmPackages":
			return 	{npmPackages: "*webpack*"};
			break;
	}
}

export default async function info() {

	Object.keys(argv).forEach(async (flag) => {
		if (AVAILABLE_FLAGS.includes(flag)) {
			const flagVal = informationType(flag);
			process.stdout.write(await envinfo.run(flagVal));
		}
	});
}

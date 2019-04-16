import * as envinfo from "envinfo";
import * as process from "process";
import {argv} from "yargs";
/**
 * Prints debugging information for webpack issue reporting
 */
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
		const flagVal = informationType(flag);
		if (flagVal) {
		process.stdout.write(await envinfo.run(flagVal));
		}
	});
}

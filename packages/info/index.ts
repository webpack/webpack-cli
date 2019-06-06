import * as envinfo from "envinfo";
import * as process from "process";

/**
 * Prints debugging information for webpack issue reporting
 */

interface Information {
	Binaries: string[];
	Browsers: string[];
	System: string[];
	npmGlobalPackages: string[];
	npmPackages: string | string[];
}

// eslint-disable-next-line
export function information(): Information {
	return {
		Binaries: ["Node", "Yarn", "npm"],
		Browsers: ["Chrome", "Firefox", "Safari"],
		System: ["OS", "CPU"],
		npmGlobalPackages: ["webpack", "webpack-cli"],
		npmPackages: "*webpack*"
	};
}

export default async function info(): Promise<void> {
	process.stdout.write(await envinfo.run(information()));
}

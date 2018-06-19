import * as envinfo from "envinfo";
import * as process from "process";

/**
 * Prints debugging information for webpack issue reporting
 */

export default async function info() {
	process.stdout.write(
		await envinfo.run({
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			System: ["OS", "CPU"],
			npmGlobalPackages: ["webpack", "webpack-cli"],
			npmPackages: "*webpack*",
		}),
	);
}

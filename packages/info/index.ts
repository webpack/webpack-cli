import envinfo from "envinfo";

/**
 * Prints debugging information for webpack issue reporting
 */

export default async function info() {
	console.log(
		await envinfo.run({
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			System: ["OS", "CPU"],
			npmGlobalPackages: ["webpack", "webpack-cli"],
			npmPackages: "*webpack*",
		}),
	);
}

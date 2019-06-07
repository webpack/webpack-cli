import { WebpackOptions } from "../types/index";

export default function checkDefaults(webpackConfig: WebpackOptions, option: any): boolean {
	console.log(webpackConfig, option);
	process.exit(0);
	return true;
}

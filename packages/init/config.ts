// Interface from @webpack-cli/generators/types
import {IWebpackOptions} from "@webpack-cli/generators/types";
import {ITransformConfig} from "@webpack-cli/utils/modify-config-helper";
import { PathLike } from "fs";
/**
 * Config class responsible for handling config generation
 */
export class Config {
	// Data members
	private configName: string;
	private topScope: string[];
	private webpackOptions: IWebpackOptions;
	private merge: object;
	private configPath: string;
	constructor() {
		this.configName = "";
		this.topScope = [""];
		this.webpackOptions = {};
		this.merge = {};
		this.configPath = process.cwd();
	}

	public pushToTopScope(...args: string[]): void {
		args.forEach((el) => {
			this.topScope.push(el);
		});
	}

	public setConfigName(configName: string): void {
		this.configName = configName;
	}

	public setWebpackOption(optionName: string, value: any): void {
		this.webpackOptions[optionName] = value;
	}

	public exportConfig(): ITransformConfig {
		const outputConfig = {
			config: {
				configName: this.configName,
				merge: this.merge,
				topScope: this.topScope,
				webpackOptions: this.webpackOptions,
			},
			configPath : this.configPath,
		};
		return outputConfig;
	}
}

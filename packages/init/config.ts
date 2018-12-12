// Interface from @webpack-cli/generators/types
import {IWebpackOptions} from "@webpack-cli/generators/types";
import {ITransformConfig} from "@webpack-cli/utils/modify-config-helper";

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

	/**
	 * Contructor for config class
	 * @summary sets default values of each Data member
	 */
	constructor() {
		this.configName = "";
		this.topScope = [""];
		this.webpackOptions = {};
		this.merge = {};
		this.configPath = process.cwd();
	}

	/**
	 * pushToTopScope
	 * @summary push lines to topScope of config to be scaffolded
	 * @param args : string[] ( An array of lines to be pushed to topScope )
	 */
	public pushToTopScope(...args: string[]): void {
		args.forEach((el) => {
			this.topScope.push(el);
		});
	}

	/**
	 * setConfigName
	 * @summary set name of config to be scaffolded to configName
	 * @param configName : string (The name of config to be scaffolded)
	 */
	public setConfigName(configName: string): void {
		this.configName = configName;
	}

	/**
	 * setWebpackOption
	 * @param optionName A option Name in accordance to interface IWebpackOptions
	 * @param value The vaule of the optionName
	 */
	public setWebpackOption(optionName: string, value: any): void {
		this.webpackOptions[optionName] = value;
	}

	/**
	 * exportConfig()
	 * @returns outputConfig The Config to be scaffolded ( passed to runTransform() )
	 */
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

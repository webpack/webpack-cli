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
	constructor() {
		this.configName = "";
		this.topScope = [""];
		this.webpackOptions = {};
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
				topScope: this.topScope,
				webpackOptions: this.webpackOptions,
			},
			configPath : process.cwd(),
		};
		return outputConfig;
	}
}

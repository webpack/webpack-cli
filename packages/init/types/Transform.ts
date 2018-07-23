export interface IWebpackProperties extends Object {
	configFile: string;
	configPath: string;
	webpackOptions: IConfiguration;
	config: {
		item: string;
		configName: string;
	};
}

export interface IConfiguration extends Object {
	configName: string;
	webpackOptions: object;
	topScope: string[];
}

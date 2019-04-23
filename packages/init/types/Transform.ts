export interface WebpackProperties extends Object {
	configFile: string;
	configPath: string;
	webpackOptions: Configuration;
	config: {
		item: string;
		configName: string;
	};
}

export interface Configuration extends Object {
	configName: string;
	webpackOptions: object;
	topScope: string[];
}

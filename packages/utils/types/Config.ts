export interface Config extends Object {
	item?: {
		name: string;
	};
	topScope?: string[];
	configName?: string;
	merge: string | string[];
	webpackOptions: object;
}

export interface TransformConfig extends Object {
	configPath?: string;
	configFile?: string;
	config?: Config;
}

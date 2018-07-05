export interface ISchemaProperties {
	additionalProperties?: boolean;
	definitions?: object;
	properties?: object;
	type?: string;
}

export interface IWebpackOptions {
	amd?: any;
	bail?: any;
	cache?: any;
	context?: any;
	devServer?: any;
	devtool?: any;
	entry?: any;
	externals?: any;
	merge?: any;
	mode?: any;
	module?: any;
	node?: any;
	output?: any;
	optimization?: any;
	parallelism?: any;
	performance?: any;
	plugins?: any;
	profile?: any;
	recordsInputPath?: any;
	recordsOutputPath?: any;
	recordsPath?: any;
	resolve?: any;
	resolveLoader?: any;
	stats?: any;
	splitChunks?: any;
	target?: any;
	watch?: any;
	watchOptions?: any;
}

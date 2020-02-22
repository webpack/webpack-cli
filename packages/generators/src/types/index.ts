export interface SchemaProperties {
	additionalProperties?: boolean;
	definitions?: object;
	properties?: object;
	type?: string;
}

interface WebpackResolve {
	alias?: object;
	aliasFields?: string[];
	cachePredicate?: Function;
	cacheWithContext?: boolean;
	descriptionFiles?: string[];
	enforceExtension?: boolean;
	enforceModuleExtension?: boolean;
	extensions?: string[];
	mainFields?: string[];
	mainFiles?: string[];
	moduleExtensions?: string[];
	modules?: string[];
	plugins?: object[] | Function[];
	symlinks?: boolean;
	concord?: boolean;
	unsafeCache?: boolean | object;
	useSyncFileSystemCalls?: boolean;
}

type IRuleSetCondition = RegExp | string | Function | object;

export interface WebpackOptions {
	amd?: string;
	bail?: boolean;
	cache?: boolean | object;
	context?: string;
	devServer?: {
		hot?: boolean;
		hotOnly?: boolean;
		lazy?: boolean;
		bonjour?: boolean;
		host?: string;
		allowedHosts?: string[];
		filename?: string | RegExp;
		publicPath?: string;
		port?: number | string;
		socket?: string;
		watchOptions?: object;
		headers?: object;
		logLevel?: string;
		clientLogLevel?: string;
		overlay?:
			| boolean
			| {
					errors?: boolean;
					warnings?: boolean;
			  };
		progress?: boolean;
		key?: string | Buffer;
		cert?: string | Buffer;
		ca?: string | Buffer;
		pfx?: string | Buffer;
		pfxPassphrase?: string;
		requestCert?: boolean;
		inline?: boolean;
		disableHostCheck?: boolean;
		public?: string;
		https?: object | boolean;
		contentBase?: false | number | string | string[];
		watchContentBase?: boolean;
		open?: string | boolean;
		useLocalIp?: boolean;
		openPage?: string;
		compress?: boolean;
		proxy?: object[] | Function[];
		historyApiFallback?:
			| boolean
			| {
					rewrites?: object[];
					disableDotRule?: boolean;
			  };
		staticOptions?: object;
		setup?: Function;
		before?: Function;
		after?: Function;
		stats?: boolean | object | string;
		reporter?: Function;
		logTime?: boolean;
		noInfo?: boolean;
		quiet?: boolean;
		serverSideRender?: boolean;
		index?: string;
		log?: Function;
		warn?: Function;
	};
	devtool?: string;
	entry?: string | object | Function;
	externals?: string | object | boolean | Function | RegExp;
	mode?: "development" | "production" | "none" | string;
	module?: {
		exprContextCritical?: boolean;
		exprContextRecursive?: boolean;
		exprContextRegExp?: boolean | RegExp;
		exprContextRequest?: string;
		noParse?: string | string[] | Function | RegExp | RegExp[];
		rules?: Rule[];
		unknownContextCritical?: boolean;
		unknownContextRecursive?: boolean;
		unknownContextRegExp?: boolean | RegExp;
		unknownContextRequest?: string;
		unsafeCache?: boolean | Function;
		wrappedContextCritical?: boolean;
		wrappedContextRecursive?: boolean;
		wrappedContextRegExp?: RegExp;
		strictExportPresence?: boolean;
		strictThisContextOnImports?: boolean;
	};
	node?:
		| false
		| true
		| string
		| {
				console?: boolean | string;
				process?: boolean | string;
				global?: boolean;
				__filename?: boolean | string;
				__dirname?: boolean | string;
				Buffer?: boolean | string;
				setImmediate?: boolean | string;
		  };
	output?: {
		auxiliaryComment?: string | object;
		chunkFilename?: string;
		chunkLoadTimeout?: number;
		crossOriginLoading?: boolean | string;
		jsonpScriptType?: string;
		devtoolFallbackModuleFilenameTemplate?: string | Function;
		devtoolLineToLine?: boolean | object;
		devtoolModuleFilenameTemplate?: string | Function;
		devtoolNamespace?: string;
		filename?: string | Function;
		hashDigest?: "latin1" | string;
		hashDigestLength?: number;
		hashFunction?: string | Function;
		hashSalt?: string;
		hotUpdateChunkFilename?: string | Function;
		hotUpdateFunction?: Function;
		hotUpdateMainFilename?: string | Function;
		jsonpFunction?: string;
		library?: string | object;
		path?: string;
	};
	optimization?: {
		removeAvailableModules?: boolean;
		removeEmptyChunks?: boolean;
		mergeDuplicateChunks?: boolean;
		flagIncludedChunks?: boolean;
		occurrenceOrder?: boolean;
		sideEffects?: boolean;
		providedExports?: boolean;
		usedExports?: boolean;
		concatenateModules?: boolean;
		splitChunks?: {
			chunks?: string;
			minSize?: number;
			maxSize?: number;
			minChunks?: number;
			maxAsyncRequests?: number;
			maxInitialRequests?: number;
			name?: boolean | Function | string;
			filename?: string;
			automaticNameDelimiter?: string;
			hidePathInfo?: boolean;
			fallbackCacheGroup?: {
				minSize?: number;
				maxSize?: number;
				automaticNameDelimiter?: number;
			};
			cacheGroups?: number | boolean | string | Function | RegExp | object;
			runtimeChunk?: boolean | string | object;
			noEmitOnErrors?: boolean;
			checkWasmTypes?: boolean;
			mangleWasmImports?: boolean;
			namedModules?: boolean;
			hashedModuleIds?: boolean;
			namedChunks?: boolean;
			portableRecords?: boolean;
			minimize?: boolean;
			minimizer?: object[] | Function[];
			nodeEnv?: false | string;
		};
	};
	parallelism?: number;
	performance?:
		| false
		| {
				assetFilter?: Function;
				hints?: false | string;
				maxEntrypointSize?: number;
				maxAssetSize?: number;
		  };
	plugins?: object[] | Function[] | string[] | string;
	profile?: boolean;
	recordsInputPath?: string;
	recordsOutputPath?: string;
	recordsPath?: string;
	resolve?: WebpackResolve;
	resolveLoader?: WebpackResolve;
	stats?: string | boolean | object;
	target?: string | Function;
	watch?: boolean;
	watchOptions?: {
		aggregateTimeout?: number;
		stdin?: boolean;
		poll?: boolean | number;
	};
}

export interface Rule {
	enforce?: "pre" | "post";
	exclude?: IRuleSetCondition;
	include?: IRuleSetCondition;
	issuer?: IRuleSetCondition;
	loader?: string | Function | object;
	loaders?: Function[] | object[];
	options?: object;
	parser?: object;
	sideEffects?: boolean;
	type?: string;
	resource?: IRuleSetCondition;
	resourceQuery?: IRuleSetCondition;
	compiler?: IRuleSetCondition;
	rules?: object[];
	use?: object | object[] | Function;
	test?: IRuleSetCondition;
}

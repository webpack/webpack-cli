import Generator from 'yeoman-generator';

export interface SchemaProperties {
    additionalProperties?: boolean;
    definitions?: Record<string, unknown>;
    properties?: Record<string, unknown>;
    type?: string;
}

interface WebpackResolve {
    alias?: Record<string, unknown>;
    aliasFields?: string[];
    cachePredicate?: () => void;
    cacheWithContext?: boolean;
    descriptionFiles?: string[];
    enforceExtension?: boolean;
    enforceModuleExtension?: boolean;
    extensions?: string[];
    mainFields?: string[];
    mainFiles?: string[];
    moduleExtensions?: string[];
    modules?: string[];
    plugins?: Record<string, unknown>[] | Array<() => void>;
    symlinks?: boolean;
    concord?: boolean;
    unsafeCache?: boolean | Record<string, unknown>;
    useSyncFileSystemCalls?: boolean;
}

type IRuleSetCondition = RegExp | string | (() => void) | Record<string, string> | string[];

export interface WebpackOptions {
    amd?: string;
    bail?: boolean;
    cache?: boolean | Record<string, unknown>;
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
        watchOptions?: Record<string, unknown>;
        headers?: Record<string, unknown>;
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
        https?: Record<string, unknown> | boolean;
        contentBase?: false | number | string | string[];
        watchContentBase?: boolean;
        open?: string | boolean;
        useLocalIp?: boolean;
        openPage?: string;
        compress?: boolean;
        proxy?: Record<string, unknown>[] | Array<() => void>;
        historyApiFallback?:
            | boolean
            | {
                  rewrites?: Record<string, unknown>[];
                  disableDotRule?: boolean;
              };
        staticOptions?: Record<string, unknown>;
        setup?: () => void;
        before?: () => void;
        after?: () => void;
        stats?: boolean | Record<string, unknown> | string;
        reporter?: () => void;
        logTime?: boolean;
        noInfo?: boolean;
        quiet?: boolean;
        serverSideRender?: boolean;
        index?: string;
        log?: () => void;
        warn?: () => void;
    };
    devtool?: string;
    entry?: string | Record<string, string> | (() => void);
    externals?: string | Record<string, unknown> | boolean | (() => void) | RegExp;
    mode?: 'development' | 'production' | 'none' | string;
    module?: {
        exprContextCritical?: boolean;
        exprContextRecursive?: boolean;
        exprContextRegExp?: boolean | RegExp;
        exprContextRequest?: string;
        noParse?: string | string[] | (() => void) | RegExp | RegExp[];
        rules?: Rule[];
        unknownContextCritical?: boolean;
        unknownContextRecursive?: boolean;
        unknownContextRegExp?: boolean | RegExp;
        unknownContextRequest?: string;
        unsafeCache?: boolean | (() => void);
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
        auxiliaryComment?: string | Record<string, unknown>;
        chunkFilename?: string;
        chunkLoadTimeout?: number;
        crossOriginLoading?: boolean | string;
        jsonpScriptType?: string;
        devtoolFallbackModuleFilenameTemplate?: string | (() => void);
        devtoolLineToLine?: boolean | Record<string, unknown>;
        devtoolModuleFilenameTemplate?: string | (() => void);
        devtoolNamespace?: string;
        filename?: string | (() => void);
        hashDigest?: 'latin1' | string;
        hashDigestLength?: number;
        hashFunction?: string | (() => void);
        hashSalt?: string;
        hotUpdateChunkFilename?: string | (() => void);
        hotUpdateFunction?: () => void;
        hotUpdateMainFilename?: string | (() => void);
        jsonpFunctiion?: string;
        library?: string | Record<string, unknown>;
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
            name?: boolean | (() => void) | string;
            filename?: string;
            automaticNameDelimiter?: string;
            hidePathInfo?: boolean;
            fallbackCacheGroup?: {
                minSize?: number;
                maxSize?: number;
                automaticNameDelimiter?: number;
            };
            cacheGroups?: number | boolean | string | (() => void) | RegExp | Record<string, unknown>;
            runtimeChunk?: boolean | string | Record<string, unknown>;
            noEmitOnErrors?: boolean;
            checkWasmTypes?: boolean;
            mangleWasmImports?: boolean;
            namedModules?: boolean;
            hashedModuleIds?: boolean;
            namedChunks?: boolean;
            portableRecords?: boolean;
            minimize?: boolean;
            minimizer?: Record<string, unknown>[] | Array<() => void>;
            nodeEnv?: false | string;
        };
    };
    parallelism?: number;
    performance?:
        | false
        | {
              assetFilter?: () => void;
              hints?: false | string;
              maxEntrypointSize?: number;
              maxAssetSize?: number;
          };
    plugins?: Record<string, unknown>[] | Array<() => void> | string[] | string;
    profile?: boolean;
    recordsInputPath?: string;
    recordsOutputPath?: string;
    recordsPath?: string;
    resolve?: WebpackResolve;
    resolveLoader?: WebpackResolve;
    stats?: string | boolean | Record<string, unknown>;
    target?: string | (() => void);
    watch?: boolean;
    watchOptions?: {
        aggregateTimeout?: number;
        stdin?: boolean;
        poll?: boolean | number;
    };
}

export interface Rule {
    enforce?: 'pre' | 'post';
    exclude?: IRuleSetCondition;
    include?: IRuleSetCondition;
    issuer?: IRuleSetCondition;
    loader?: string | (() => void) | Record<string, unknown>;
    loaders?: Array<() => void> | Record<string, unknown>[];
    options?: Record<string, unknown>;
    parser?: Record<string, unknown>;
    sideEffects?: boolean;
    type?: string;
    resource?: IRuleSetCondition;
    resourceQuery?: IRuleSetCondition;
    compiler?: IRuleSetCondition;
    rules?: Record<string, unknown>[];
    test?: IRuleSetCondition;
}

export class CustomGenerator extends Generator {
    public entryOption: string | Record<string, string>;
    public configuration: {
        config: {
            configName?: string;
            topScope?: string[];
            webpackOptions?: WebpackOptions;
        };
    };
    public isProd: boolean;
    public dependencies: string[];
    public getTemplatePath: (template: string) => string;
}

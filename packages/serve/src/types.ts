export type devServerOptionsType = {
    bonjour?: boolean;
    client?: devServerClientOptions;
    compress?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dev?: Record<string, any>; // drop in dev-server v3
    devMiddleware?: Record<string, any>;
    firewall?: boolean | string[];
    headers?: Record<string, unknown>;
    historyApiFallback?: boolean | Record<string, unknown>;
    host?: string | null;
    hot?: boolean | hotOptionEnum;
    http2?: boolean;
    https?: boolean | Record<string, unknown>;
    injectClient?: boolean | (() => void);
    injectHot?: boolean | (() => void);
    liveReload?: boolean;
    onAfterSetupMiddleware?: () => void;
    onBeforeSetupMiddleware?: () => void;
    onListening?: () => void;
    open?: string | boolean | openOptionObject;
    overlay?: boolean | Record<string, unknown>;
    port?: number | string | null;
    profile?: boolean;
    progress?: boolean;
    proxy?: Record<string, unknown> | (Record<string, unknown> | (() => void))[];
    public?: string;
    static?: boolean | string | Record<string, unknown> | (string | Record<string, unknown>)[];
    transportMode?: Record<string, unknown> | string;
    useLocalIp?: boolean;
    publicPath?: string | (() => void);
    stats?: string | boolean;
    watchFiles?: string | Record<string, unknown>;
};

enum hotOptionEnum {
    only = 'only',
}

type devServerClientOptions = {
    host?: string;
    path?: string;
    port?: string | number | null;
    logging?: devServerClientLogging;
    progress?: boolean;
    overlay?: boolean | clientOverlay;
    needClientEntry?: boolean | (() => void);
    needHotEntry?: boolean | (() => void);
};

type openOptionObject = {
    target?: string;
    app?: string;
};

type clientOverlay = {
    errors?: boolean;
    warnings?: boolean;
};

enum devServerClientLogging {
    none = 'none',
    error = 'error',
    warn = 'warn',
    info = 'info',
    log = 'log',
    verbose = 'verbose',
}

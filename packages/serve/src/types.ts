export type devServerOptionsType = {
    bonjour?: boolean;
    client?: devServerClientOptions;
    compress?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dev?: Record<string, any>;
    firewall?: boolean | string[];
    headers?: Record<string, unknown>;
    historyApiFallback?: boolean | Record<string, unknown>;
    host?: string | null;
    hot?: boolean | string;
    http2?: boolean;
    https?: boolean | Record<string, unknown>;
    injectClient?: boolean | (() => void);
    injectHot?: boolean | (() => void);
    liveReload?: boolean;
    onAfterSetupMiddleware?: () => void;
    onBeforeSetupMiddleware?: () => void;
    onListening?: () => void;
    open?: string | boolean | Record<string, unknown>;
    openPage?: string | string[];
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
};

type devServerClientOptions = {
    host?: string;
    path?: string;
    port?: string | number | null;
    logging?: devServerClientLogging;
    progress?: boolean;
};

export enum devServerClientLogging {
    none = 'none',
    error = 'error',
    warn = 'warn',
    info = 'info',
    log = 'log',
    verbose = 'verbose',
}

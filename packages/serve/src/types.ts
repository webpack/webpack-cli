export type devServerOptionsType = {
    bonjour?: boolean;
    client?: devServerClientOptions;
    compress?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dev?: Record<string, any>;
    firewall?: boolean | string[];
    headers?: object;
    historyApiFallback?: boolean | object;
    host?: string | null;
    hot?: boolean | string;
    http2?: boolean;
    https?: boolean | object;
    injectClient?: boolean | Function;
    injectHot?: boolean | Function;
    liveReload?: boolean;
    onAfterSetupMiddleware?: Function;
    onBeforeSetupMiddleware?: Function;
    onListening?: Function;
    open?: string | boolean | object;
    openPage?: string | string[];
    overlay?: boolean | object;
    port?: number | string | null;
    profile?: boolean;
    progress?: boolean;
    proxy?: object | (object | Function)[];
    public?: string;
    static?: boolean | string | object | (string | object)[];
    transportMode?: object | string;
    useLocalIp?: boolean;
    publicPath?: string | Function;
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

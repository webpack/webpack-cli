export type devServerOptionsType = {
  allowedHosts?: string[] | allowedHostsEnum;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bonjour?: boolean | Record<string, any>;
  client?: false | devServerClientOptions;
  compress?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dev?: Record<string, any>; // drop in dev-server v4
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  devMiddleware?: Record<string, any>;
  firewall?: boolean | string[];
  headers?:
    | Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((request: any, response: any, middlewareContext: any) => Record<string, any>);
  historyApiFallback?: boolean | Record<string, unknown>;
  host?: string | null | hostEnum;
  hot?: boolean | hotOptionEnum;
  http2?: boolean;
  https?: boolean | Record<string, unknown>;
  injectClient?: boolean | (() => void);
  injectHot?: boolean | (() => void);
  ipc?: string | true;
  liveReload?: boolean;
  onAfterSetupMiddleware?: () => void;
  onBeforeSetupMiddleware?: () => void;
  onListening?: () => void;
  open?: string | boolean | openOptionObject;
  openPage?: string | string[];
  overlay?: boolean | Record<string, unknown>;
  port?: number | string | null;
  profile?: boolean;
  progress?: boolean;
  proxy?: Record<string, unknown> | (Record<string, unknown> | (() => void))[];
  public?: string;
  setupExitSignals?: boolean;
  static?: boolean | string | Record<string, unknown> | (string | Record<string, unknown>)[];
  transportMode?: Record<string, unknown> | string;
  useLocalIp?: boolean;
  publicPath?: string | (() => void);
  stats?: string | boolean;
  watchFiles?: string | Record<string, unknown>;
  webSocketServer?:
    | false
    | string
    | transportModeEnum
    | (() => any)
    | Record<string, unknown>
    | (Record<string, unknown> | (() => void))[];
};

enum hotOptionEnum {
  only = "only",
}

enum hostEnum {
  LocalIp = "local-ip",
  LocalIpv4 = "local-ipv4",
  LocalIpv6 = "local-ipv6",
}

enum allowedHostsEnum {
  Auto = "auto",
  All = "all",
}

enum transportModeEnum {
  SockJS = "sockjs",
  Ws = "ws",
}

type devServerClientOptions = {
  host?: string;
  path?: string;
  port?: string | number | null;
  needClientEntry?: boolean | (() => void);
  needHotEntry?: boolean | (() => void);
  logging?: devServerClientLogging;
  overlay?: boolean | clientOverlay;
  progress?: boolean;
  webSocketTransport?: string | transportModeEnum;
  webSocketURL?: string | webSocketURLOptions;
};

type webSocketURLOptions = {
  hostname?: string;
  pathname?: string;
  port?: string | number;
  password?: string;
  protocol?: string | "auto";
  username?: string;
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
  none = "none",
  error = "error",
  warn = "warn",
  info = "info",
  log = "log",
  verbose = "verbose",
}

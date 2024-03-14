import { WebpackCLIExternalCommandInfo, WebpackCLIOptions } from "../types";

const WEBPACK_PACKAGE_IS_CUSTOM = !!process.env.WEBPACK_PACKAGE;
const WEBPACK_PACKAGE = WEBPACK_PACKAGE_IS_CUSTOM
  ? (process.env.WEBPACK_PACKAGE as string)
  : "webpack";

export const getKnownCommands = (): WebpackCLIOptions[] => {
  // Built-in internal commands
  const buildCommandOptions = {
    name: "build [entries...]",
    alias: ["bundle", "b"],
    description: "Run webpack (default command, can be omitted).",
    usage: "[entries...] [options]",
    dependencies: [WEBPACK_PACKAGE],
  };
  const watchCommandOptions = {
    name: "watch [entries...]",
    alias: "w",
    description: "Run webpack and watch for files changes.",
    usage: "[entries...] [options]",
    dependencies: [WEBPACK_PACKAGE],
  };
  const versionCommandOptions = {
    name: "version",
    alias: "v",
    usage: "[options]",
    description:
      "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
  };
  const setupAutocompleteCommandOptions = {
    name: "setup-autocomplete",
    alias: "a",
    usage: "[options]",
    description: "Setup tab completion for your shell",
  };
  const helpCommandOptions = {
    name: "help [command] [option]",
    alias: "h",
    description: "Display help for commands and options.",
  };
  // Built-in external commands
  const externalBuiltInCommandsInfo: WebpackCLIExternalCommandInfo[] = [
    {
      name: "serve [entries...]",
      alias: ["server", "s"],
      pkg: "@webpack-cli/serve",
    },
    {
      name: "info",
      alias: "i",
      pkg: "@webpack-cli/info",
    },
    {
      name: "init",
      alias: ["create", "new", "c", "n"],
      pkg: "@webpack-cli/generators",
    },
    {
      name: "loader",
      alias: "l",
      pkg: "@webpack-cli/generators",
    },
    {
      name: "plugin",
      alias: "p",
      pkg: "@webpack-cli/generators",
    },
    {
      name: "configtest [config-path]",
      alias: "t",
      pkg: "@webpack-cli/configtest",
    },
  ];

  const knownCommands = [
    buildCommandOptions,
    watchCommandOptions,
    versionCommandOptions,
    helpCommandOptions,
    setupAutocompleteCommandOptions,
    ...externalBuiltInCommandsInfo,
  ];

  return knownCommands;
};

export const getExternalBuiltInCommandsInfo = (): WebpackCLIExternalCommandInfo[] => {
  return [
    {
      name: "serve [entries...]",
      alias: ["server", "s"],
      pkg: "@webpack-cli/serve",
    },
    {
      name: "info",
      alias: "i",
      pkg: "@webpack-cli/info",
    },
    {
      name: "init",
      alias: ["create", "new", "c", "n"],
      pkg: "@webpack-cli/generators",
    },
    {
      name: "loader",
      alias: "l",
      pkg: "@webpack-cli/generators",
    },
    {
      name: "plugin",
      alias: "p",
      pkg: "@webpack-cli/generators",
    },
    {
      name: "configtest [config-path]",
      alias: "t",
      pkg: "@webpack-cli/configtest",
    },
  ];
};

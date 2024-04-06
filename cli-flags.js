const cliFlags = [
  {
    name: "mode",
    usage: "--mode <mode>",
    description: "The mode to run the analyzer in: server, static, or disabled.",
    type: String,
    defaultValue: "server",
  },
  {
    name: "report",
    usage: "--report <path>",
    description: 'Path to bundle report file that will be generated in "static" mode.',
    type: String,
  },
  {
    name: "open",
    usage: "--open",
    description: "Automatically open report in default browser.",
    type: Boolean,
    defaultValue: false,
  },
  {
    name: "port",
    usage: "--port <number>",
    description: "Port that will be used in `server` mode, default is 8888.",
    type: Number,
    defaultValue: 8888,
  },
  {
    name: "host",
    usage: "--host <address>",
    description: "Host that will be used in `server` mode, default is 127.0.0.1.",
    type: String,
    defaultValue: "127.0.0.1",
  },
  {
    name: "log-level",
    usage: "--log-level <level>",
    description: "Level of logger (info, warn, error, silent).",
    type: String,
    values: ["debug", "info", "warn", "error", "silent"],
    defaultValue: "info",
    multiple: true,
  },
  {
    name: "exclude",
    usage: "--exclude <regexp> ",
    description: "Assets that should be excluded from the report.",
    type: String,
    defaultValue: "info",
  },
];

module.exports = { cliFlags };

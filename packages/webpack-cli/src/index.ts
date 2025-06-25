import WebpackCLI from "./webpack-cli.js";

export type * from "./types.js";
export { default } from "./webpack-cli.js";

// TODO remove me in the next major release and use `default` export
module.exports = WebpackCLI;

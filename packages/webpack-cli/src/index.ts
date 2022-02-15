import { IWebpackCLI } from "./types";
export * from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CLI: IWebpackCLI = require("./webpack-cli");

module.exports = CLI;
// TODO remove after drop `@webpack-cli/migrate`
module.exports.utils = { logger: console };

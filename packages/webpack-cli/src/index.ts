import { type IWebpackCLI } from "./types";
export type * from "./types";

const CLI: IWebpackCLI = require("./webpack-cli");

module.exports = CLI;

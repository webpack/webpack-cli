const CLI = require("./webpack-cli");

module.exports = CLI;
// TODO remove after drop `@webpack-cli/migrate`
// @ts-ignore
module.exports.utils = { logger: console };

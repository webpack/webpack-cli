"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmdArgs = require("command-line-args");
const WebpackCLI = require("../../lib/webpack-cli");
const startDevServer = require("./startDevServer");
const argsToCamelCase = require("./argsToCamelCase");
const flags_1 = require("./flags");
const cli_flags_1 = require("../../lib/utils/cli-flags");
/**
 *
 * Creates a webpack compiler and runs the devServer
 *
 * @param {String[]} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */
function serve(args) {
    const cli = new WebpackCLI();
    // partial parsing usage: https://github.com/75lb/command-line-args/wiki/Partial-parsing
    // since the webpack flags have the 'entry' option set as it's default option,
    // we need to parse the dev server args first. Otherwise, the webpack parsing could snatch
    // one of the dev server's options and set it to this 'entry' option.
    // see: https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md#optiondefaultoption--boolean
    const devServerArgs = cmdArgs(flags_1.devServer, { argv: args, partial: true });
    const webpackArgs = cmdArgs(cli_flags_1.core, { argv: devServerArgs._unknown || [], stopAtFirstUnknown: false });
    const finalArgs = argsToCamelCase.default(devServerArgs._all || {});
    // pass along the 'hot' argument to the dev server if it exists
    if (webpackArgs && webpackArgs._all && typeof webpackArgs._all.hot !== 'undefined') {
        finalArgs['hot'] = webpackArgs._all.hot;
    }
    return new Promise((resolve) => {
        cli.getCompiler(webpackArgs, cli_flags_1.core).then((compiler) => {
            startDevServer.default(compiler, finalArgs, resolve);
        });
    });
}
exports.default = serve;
//# sourceMappingURL=index.js.map
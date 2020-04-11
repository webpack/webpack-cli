import semver from 'semver';
import chalk from 'chalk';
import { devServer } from 'webpack-dev-server/bin/cli-flags';
import WebpackCLI from 'webpack-cli';
import startDevServer from './startDevServer';
import argsToCamelCase from './args-to-camel-case';

/**
 *
 * Creates a webpack compiler and runs the devServer
 *
 * @param {String[]} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */
export default function serve(...args): void {
    let deprecatedDevServerVersion = false;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const devServerPackage = require('webpack-dev-server/package.json');
        deprecatedDevServerVersion = semver.lt(devServerPackage.version, '4.0.0');
        // eslint-disable-next-line no-empty
    } catch (e) {}

    const cli = new WebpackCLI();
    const core = cli.getCoreFlags();
    // partial parsing usage: https://github.com/75lb/command-line-args/wiki/Partial-parsing

    // since the webpack flags have the 'entry' option set as it's default option,
    // we need to parse the dev server args first. Otherwise, the webpack parsing could snatch
    // one of the dev server's options and set it to this 'entry' option.
    // see: https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md#optiondefaultoption--boolean
    const devServerArgs = cli.commandLineArgs(devServer, { argv: args, partial: true });
    const webpackArgs = cli.commandLineArgs(core, { argv: devServerArgs._unknown || [], stopAtFirstUnknown: false });
    const finalArgs = argsToCamelCase(devServerArgs._all || {});
    // pass along the 'hot' argument to the dev server if it exists
    if (webpackArgs && webpackArgs._all && typeof webpackArgs._all.hot !== 'undefined') {
        finalArgs['hot'] = webpackArgs._all.hot;
    }
    cli.getCompiler(webpackArgs, core).then((compiler): void => {
        const server = startDevServer(compiler, finalArgs);

        if (deprecatedDevServerVersion) {
            const warning = chalk.yellow.bold(
                'Using webpack-dev-server v3 with ' +
                    `${chalk.green('webpack-cli serve')} is deprecated and will lead to ` +
                    'unexpected behavior. Please upgrade to webpack-dev-server v4.',
            );
            server.log.warn(warning);

            // send a warning after the compilation to ensure that the message
            // reaches the user
            compiler.hooks.done.tap('serve', () => {
                process.nextTick(() => {
                    server.log.warn(warning);
                });
            });
        }
    });
}

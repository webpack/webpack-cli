import WebpackCLI from 'webpack-cli';
import startDevServer from './startDevServer';
import parseArgs from './parseArgs';

/**
 *
 * Creates a webpack compiler and runs the devServer
 *
 * @param {String[]} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */
export default function serve(...args: string[]): void {
    let devServerFlags: object[];
    try {
        devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;
    } catch (err) {
        throw new Error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
    }

    const cli = new WebpackCLI();
    const core = cli.getCoreFlags();

    const { webpackArgs, devServerArgs } = parseArgs(cli, devServerFlags, args);

    cli.getCompiler(webpackArgs, core).then((compiler): void => {
        startDevServer(compiler, devServerArgs);
    });
}

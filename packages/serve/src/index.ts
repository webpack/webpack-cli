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
    try {
        // eslint-disable-next-line node/no-extraneous-require
        require('webpack-dev-server');
    } catch (err) {
        throw new Error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
    }
    const cli = new WebpackCLI();

    const { webpackArgs, devServerArgs } = parseArgs(cli, args);

    cli.getCompiler(webpackArgs).then((compiler): void => {
        startDevServer(compiler, devServerArgs);
    });
}

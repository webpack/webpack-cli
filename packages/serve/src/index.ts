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
    const cli = new WebpackCLI();
    const core = cli.getCoreFlags();

    const { webpackArgs, devServerArgs } = parseArgs(cli, args);

    cli.getCompiler(webpackArgs, core).then((compiler): void => {
        startDevServer(compiler, devServerArgs);
    });
}

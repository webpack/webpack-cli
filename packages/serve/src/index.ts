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

    // add WEBPACK_SERVE to compilation environment
    args = [...args, '--env', 'WEBPACK_SERVE=true'];

    const { webpackArgs, devServerArgs } = parseArgs(cli, args);

    cli.getCompiler(webpackArgs).then((compiler): void => {
        startDevServer(compiler, devServerArgs);
    });
}

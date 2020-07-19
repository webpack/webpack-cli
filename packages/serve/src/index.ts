import { devServer } from 'webpack-dev-server/bin/cli-flags';
import WebpackCLI from 'webpack-cli';
import logger from 'webpack-cli/lib/utils/logger';
import startDevServer from './startDevServer';

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

    const parsedDevServerArgs = cli.argParser(devServer, args, true);
    if (parsedDevServerArgs.unknownArgs.some((arg) => ['help', 'version', 'color'].includes(arg))) return;

    const devServerArgs = parsedDevServerArgs.opts;
    const parsedWebpackArgs = cli.argParser(core, parsedDevServerArgs.unknownArgs, true, process.title);
    const webpackArgs = parsedWebpackArgs.opts;

    // pass along the 'hot' argument to the dev server if it exists
    if (webpackArgs && webpackArgs.hot !== undefined) {
        devServerArgs['hot'] = webpackArgs.hot;
    }

    if (parsedWebpackArgs.unknownArgs.length > 0) {
        parsedWebpackArgs.unknownArgs
            .filter((e) => e)
            .forEach((unknown) => {
                logger.warn('Unknown argument:', unknown);
            });
        return;
    }

    cli.getCompiler(webpackArgs, core).then((compiler): void => {
        startDevServer(compiler, devServerArgs);
    });
}

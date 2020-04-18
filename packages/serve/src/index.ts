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
export default function serve(): void {
    const cli = new WebpackCLI();
    const core = cli.getCoreFlags();

    const filteredArgs = process.argv.filter((arg) => arg != 'serve');
    const parsedDevServerArgs = cli.argParser(devServer, filteredArgs);
    const devServerArgs = parsedDevServerArgs.opts();
    const parsedWebpackArgs = cli.argParser(core, parsedDevServerArgs.args, true, process.title);
    const webpackArgs = parsedWebpackArgs.opts();
    const finalArgs = argsToCamelCase(devServerArgs || {});

    // pass along the 'hot' argument to the dev server if it exists
    if (webpackArgs && webpackArgs.hot !== undefined) {
        finalArgs['hot'] = webpackArgs.hot;
    }

    Object.keys(finalArgs).forEach((arg) => {
        if (finalArgs[arg] === undefined) {
            delete finalArgs[arg];
        }
    });

    if (parsedWebpackArgs.args.length > 0) {
        process.stderr.write(`Unknown option: ${parsedWebpackArgs.args}\n`);
        return;
    }

    cli.getCompiler(webpackArgs, core).then((compiler): void => {
        startDevServer(compiler, finalArgs);
    });
}

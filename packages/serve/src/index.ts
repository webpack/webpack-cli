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
    const webpackArgs = cli.argParser(core, filteredArgs, false, process.title, cli.runHelp, cli.runVersion);
    const finalArgs = argsToCamelCase(devServerArgs || {});

    // pass along the 'hot' argument to the dev server if it exists
    if (webpackArgs && webpackArgs.opts() && webpackArgs.opts().hot !== undefined) {
        finalArgs['hot'] = webpackArgs.opts().hot;
    }

    Object.keys(finalArgs).forEach((arg) => {
        if (finalArgs[arg] === undefined) {
            delete finalArgs[arg];
        }
    });

    if (webpackArgs.args.length > 0) {
        process.stderr.write(`Unknown option: ${webpackArgs.args}`);
        return;
    }

    cli.getCompiler(webpackArgs.opts(), core).then((compiler): void => {
        startDevServer(compiler, finalArgs);
    });
}

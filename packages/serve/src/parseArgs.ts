import { utils } from 'webpack-cli';

const { logger } = utils;

type WebpackCLIType = {
    getCoreFlags: Function;
    argParser: Function;
};

type ArgsType = {
    devServerArgs: object;
    webpackArgs: object;
};

/**
 *
 * Parses raw dev server CLI args
 *
 * @param {Object} cli - webpack CLI object
 * @param {Object[]} devServerFlags - devServer flags
 * @param {String[]} args - unparsed devServer args processed from the CLI
 *
 * @returns {Object} parsed webpack args and dev server args objects
 */
export default function parseArgs(cli: WebpackCLIType, args: string[]): ArgsType {
    let devServerFlags;
    try {
        // eslint-disable-next-line node/no-extraneous-require
        devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;
    } catch (err) {
        logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
        process.exit(2);
    }

    const core = cli.getCoreFlags();

    const parsedDevServerArgs = cli.argParser(devServerFlags, args, true);
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
                logger.error(`Unknown argument: ${unknown}`);
            });
        process.exit(2);
    }

    return {
        devServerArgs,
        webpackArgs,
    };
}

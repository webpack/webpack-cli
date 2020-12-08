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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseArgs(cli: WebpackCLIType, args: { [key: string]: any } = {}): ArgsType {
    const core = cli.getCoreFlags();
    const devServerArgs = args;
    const parsedWebpackArgs = cli.argParser(core, [], true, process.title);
    const webpackArgs = parsedWebpackArgs.opts;

    // Add WEBPACK_SERVE environment variable
    if (webpackArgs.env) {
        webpackArgs.env.WEBPACK_SERVE = true;
    } else {
        webpackArgs.env = { WEBPACK_SERVE: true };
    }

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

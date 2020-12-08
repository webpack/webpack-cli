import WebpackCLI, { utils } from 'webpack-cli';
import startDevServer from './startDevServer';
import parseArgs from './parseArgs';

const { logger } = utils;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function serve(options: { [key: string]: any } = {}): Promise<void> {
    try {
        // eslint-disable-next-line node/no-extraneous-require
        require('webpack-dev-server');
    } catch (err) {
        logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
        process.exit(2);
    }

    const cli = new WebpackCLI();
    const { webpackArgs, devServerArgs } = parseArgs(cli, options);
    const compiler = await cli.getCompiler(webpackArgs);

    await startDevServer(compiler, devServerArgs);
}

import startDevServer from './startDevServer';

class ServeCommand {
    async apply(cli): Promise<void> {
        const { program, logger } = cli;

        program
            .command('serve')
            .alias('s')
            .description('Run the webpack Dev Server')
            .usage('serve [options]')
            .action(async (program) => {
                const options = program.opts();

                try {
                    // eslint-disable-next-line node/no-extraneous-require
                    require('webpack-dev-server');
                } catch (err) {
                    logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
                    process.exit(2);
                }

                // // Add WEBPACK_SERVE environment variable
                // if (webpackArgs.env) {
                //     webpackArgs.env.WEBPACK_SERVE = true;
                // } else {
                //     webpackArgs.env = { WEBPACK_SERVE: true };
                // }
                //
                // // pass along the 'hot' argument to the dev server if it exists
                // if (webpackArgs && webpackArgs.hot !== undefined) {
                //     devServerArgs['hot'] = webpackArgs.hot;
                // }

                const compiler = await cli.getCompiler({});

                await startDevServer(compiler, {});
            });
    }
}

export default ServeCommand;

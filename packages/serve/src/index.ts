import startDevServer from './startDevServer';

class ServeCommand {
    apply(cli): void {
        const { program, logger } = cli;

        try {
            // eslint-disable-next-line node/no-extraneous-require
            require('webpack-dev-server');
        } catch (err) {
            logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
            process.exit(2);
        }

        // TODO
        // eslint-disable-next-line node/no-extraneous-require
        const devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;

        program
            .command('serve')
            .alias('s')
            .description('Run the webpack Dev Server')
            .usage('serve [options]')
            .option('--port <value>')
            .action(async (program) => {
                const options = program.opts();

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

                await startDevServer(compiler, options);
            });
    }
}

export default ServeCommand;

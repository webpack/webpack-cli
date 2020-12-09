import startDevServer from './startDevServer';

class ServeCommand {
    apply(cli): void {
        const { logger } = cli;

        try {
            // eslint-disable-next-line node/no-extraneous-require
            require('webpack-dev-server');
        } catch (err) {
            logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
            process.exit(2);
        }

        const builtInOptions = cli.getBuiltInOptions();
        // eslint-disable-next-line node/no-extraneous-require
        const devServerOptions = require('webpack-dev-server/bin/cli-flags').devServer;

        cli.makeCommand(
            'serve',
            {
                alias: 's',
                description: 'Run the webpack dev server',
                usage: 'serve [options]',
                packageName: '@webpack-cli/serve',
                action: async (program) => {
                    const filteredBuiltInOptions: Record<string, any> = {};
                    const filteredDevServerOptions: Record<string, any> = {};
                    const options = program.opts();

                    // TODO `clientLogLevel` and `hot`
                    for (const property in options) {
                        const isDevServerOption = devServerOptions.find((devServerOption) => devServerOption.name === property);

                        if (isDevServerOption) {
                            filteredDevServerOptions[property] = options[property];
                        } else {
                            filteredBuiltInOptions[property] = options[property];
                        }
                    }

                    // TODO
                    // // Add WEBPACK_SERVE environment variable
                    // if (webpackArgs.env) {
                    //     webpackArgs.env.WEBPACK_SERVE = true;
                    // } else {
                    //     webpackArgs.env = { WEBPACK_SERVE: true };
                    // }

                    const compiler = await cli.createCompiler(filteredBuiltInOptions);

                    await startDevServer(compiler, filteredDevServerOptions);
                },
            },
            [...builtInOptions, ...devServerOptions],
        );
    }
}

export default ServeCommand;

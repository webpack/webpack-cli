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

        let devServerOptions = [];

        try {
            // eslint-disable-next-line node/no-extraneous-require
            devServerOptions = require('webpack-dev-server/bin/cli-flags').devServer;
        } catch (error) {
            // Nothing, to prevent future major release without problems
        }

        cli.makeCommand(
            {
                name: 'serve',
                alias: 's',
                description: 'Run the webpack dev server',
                usage: '[options]',
                packageName: '@webpack-cli/serve',
            },
            [...builtInOptions, ...devServerOptions],
            async (program) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filteredBuiltInOptions: Record<string, any> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        );
    }
}

export default ServeCommand;

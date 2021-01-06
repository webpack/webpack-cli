class ConfigTestCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'configtest <config-path>',
                alias: 't',
                description: 'Test your webpack configuration against validation errors.',
                usage: '<config-path>',
                pkg: '@webpack-cli/configtest',
            },
            [],
            async (configPath: string): Promise<void> => {
                //eslint-disable-next-line @typescript-eslint/no-var-requires
                const { validate, version, ValidationError, WebpackOptionsValidationError } = require('webpack');

                const isWebpack5: boolean = version.startsWith('5');
                const { options } = await cli.resolveConfig({ config: [configPath] });

                const isValidationError = (error): boolean => {
                    // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
                    // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const webpackValidationError: any = ValidationError || WebpackOptionsValidationError;

                    return error instanceof webpackValidationError;
                };

                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error: any = validate(options);

                if (error && error.length) {
                    if (isWebpack5) {
                        logger.error(isValidationError(error) ? error.message : error);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        logger.error(new WebpackOptionsValidationError(error));
                    }
                    process.exit(2);
                }

                logger.success('There are no validation errors in the given webpack configuration.');
            },
        );
    }
}

export default ConfigTestCommand;

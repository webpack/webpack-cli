import webpack from 'webpack';

class ConfigTestCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'configtest <config-path>',
                alias: 't',
                description: 'Test your webpack configuration against validation errors.',
                usage: '[configs]',
                pkg: '@webpack-cli/configtest',
            },
            [],
            async (configPath: string) => {
                const { options } = await cli.resolveConfig({ config: [configPath] });

                const isValidationError = (error) => {
                    // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
                    // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
                    const ValidationError: any = webpack.ValidationError || webpack.WebpackOptionsValidationError;

                    return error instanceof ValidationError;
                };

                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error: any = webpack.validate(options);

                if (error) {
                    logger.error(isValidationError(error) ? error.message : error);
                    process.exit(2);
                }

                logger.success('There are no errors in the given webpack configuration.');
            },
        );
    }
}

export default ConfigTestCommand;

import webpack from 'webpack';

class ConfigTestCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'configtest <config-path>',
                alias: 't',
                description: 'Tests webpack configuration against validation errors.',
                usage: '<config-path>',
                pkg: '@webpack-cli/configtest',
            },
            [],
            async (configPath: string): Promise<void> => {
                const config = await cli.resolveConfig({ config: [configPath] });

                try {
                    const error = webpack.validate(config.options);

                    // TODO remove this after drop webpack@4
                    if (error && error.length > 0) {
                        throw new webpack.WebpackOptionsValidationError(error);
                    }
                } catch (error) {
                    const isValidationError = (error) => {
                        // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
                        // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
                        const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

                        return error instanceof ValidationError;
                    };

                    if (isValidationError(error)) {
                        logger.error(error.message);
                    } else {
                        logger.error(error);
                    }

                    process.exit(2);
                }

                logger.success('There are no validation errors in the given webpack configuration.');
            },
        );
    }
}

export default ConfigTestCommand;

import { validate } from 'webpack';

class ConfigTestCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'configtest <config-path>',
                alias: 't',
                description: 'Outputs information about your system.',
                usage: '[configs]',
                pkg: '@webpack-cli/configtest',
            },
            [],
            async (configPath, program) => {
                if (program.args.length > 1) {
                    logger.error('Only one configuration can be validated at a time.');
                    process.exit(2);
                }

                const { options } = await cli.resolveConfig({ config: [configPath] });

                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validationErrors: any = validate(options);

                if (validationErrors) {
                    logger.error(validationErrors);
                }

                logger.success('There are no validation errors in the given webpack configuration.');
            },
        );
    }
}

export default ConfigTestCommand;

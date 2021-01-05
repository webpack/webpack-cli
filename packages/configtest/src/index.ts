import { validate } from 'webpack';

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

                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validationErrors: any = validate(options);

                if (validationErrors) {
                    logger.error(validationErrors);
                    process.exit(2);
                }

                logger.success('There are no validation errors in the given webpack configuration.');
            },
        );
    }
}

export default ConfigTestCommand;

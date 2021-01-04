import { validate } from 'webpack';

class ConfigTestCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'configtest',
                alias: 't',
                description: 'Outputs information about your system.',
                usage: '[configs]',
                pkg: '@webpack-cli/configtest',
            },
            [],
            async (program) => {
                const { options } = await cli.resolveConfig({ config: program.args });
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validationErrors: any = validate(options);

                if (validationErrors) {
                    logger.error("Your configuration validation wasn't successful");
                    logger.error(validationErrors);
                }

                logger.success('No errors found');
            },
        );
    }
}

export default ConfigTestCommand;

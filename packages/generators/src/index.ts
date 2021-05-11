import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

class GeneratorsCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli: any): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'init [generation-path]',
                alias: ['create', 'new', 'c', 'n'],
                description: 'Initialize a new webpack project.',
                argsDescription: {
                    'generation-path': 'Path to the installation directory, e.g. ./projectName',
                },
                usage: '[generation-path] [options]',
                pkg: '@webpack-cli/generators',
            },
            [
                {
                    name: 'template',
                    alias: 't',
                    configs: [{ type: 'string' }],
                    description: 'Type of template',
                    defaultValue: 'default',
                },
                {
                    name: 'force',
                    alias: 'f',
                    configs: [
                        {
                            type: 'enum',
                            values: [true],
                        },
                    ],
                    description: 'Generate without questions (ideally) using default answers',
                },
            ],
            async (generationPath, options) => {
                options.generationPath = generationPath || '.';

                const env = yeoman.createEnv([], { cwd: options.generationPath });
                const generatorName = 'webpack-init-generator';

                env.registerStub(initGenerator, generatorName);

                env.run(generatorName, { cli, options }, () => {
                    logger.success('Project has been initialised with webpack!');
                });
            },
        );

        await cli.makeCommand(
            {
                name: 'loader [output-path]',
                alias: 'l',
                description: 'Scaffold a loader.',
                argsDescription: {
                    'output-path': 'Path to the output directory, e.g. ./loaderName',
                },
                usage: '[output-path] [options]',
                pkg: '@webpack-cli/generators',
            },
            [
                {
                    name: 'template',
                    alias: 't',
                    configs: [{ type: 'string' }],
                    description: 'Type of template',
                    defaultValue: 'default',
                },
            ],
            async (outputPath, options) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-loader-generator';

                env.registerStub(loaderGenerator, generatorName);

                env.run(generatorName, { cli, options }, () => {
                    logger.success('Loader template has been successfully scaffolded.');
                });
            },
        );

        await cli.makeCommand(
            {
                name: 'plugin [output-path]',
                alias: 'p',
                description: 'Scaffold a plugin.',
                argsDescription: {
                    'output-path': 'Path to the output directory, e.g. ./pluginName',
                },
                usage: '[output-path] [options]',
                pkg: '@webpack-cli/generators',
            },
            [
                {
                    name: 'template',
                    alias: 't',
                    configs: [{ type: 'string' }],
                    description: 'Type of template',
                    defaultValue: 'default',
                },
            ],
            async (outputPath, options) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-plugin-generator';

                env.registerStub(pluginGenerator, generatorName);

                env.run(generatorName, { cli, options }, () => {
                    logger.success('Plugin template has been successfully scaffolded.');
                });
            },
        );
    }
}

export default GeneratorsCommand;
export { addonGenerator, initGenerator };

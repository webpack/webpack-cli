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
                name: 'init',
                alias: 'c',
                description: 'Initialize a new webpack configuration.',
                usage: '[options]',
                pkg: '@webpack-cli/generators',
            },
            [
                {
                    name: 'template',
                    type: String,
                    description: 'Type of template',
                    defaultValue: 'default',
                },
                {
                    name: 'generation-path',
                    type: String,
                    description: 'To scaffold in a specified path',
                    defaultValue: '.',
                },
                {
                    name: 'use-defaults',
                    type: Boolean,
                    description: 'Generate using defaults, ideally without questions',
                },
            ],
            async (options) => {
                const env = yeoman.createEnv([], { cwd: options.generationPath });
                const generatorName = 'webpack-init-generator';

                env.registerStub(initGenerator, generatorName);

                env.run(generatorName, { options }, () => {
                    logger.success('Project has been initialised with webpack!');
                });
            },
        );

        await cli.makeCommand(
            {
                name: 'loader [output-path]',
                alias: 'l',
                description: 'Scaffold a loader.',
                usage: 'loader [output-path]',
                pkg: '@webpack-cli/generators',
            },
            [],
            async (outputPath) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-loader-generator';

                env.registerStub(loaderGenerator, generatorName);

                env.run(generatorName, () => {
                    logger.success('Loader template has been successfully scaffolded.');
                });
            },
        );

        await cli.makeCommand(
            {
                name: 'plugin [output-path]',
                alias: 'p',
                description: 'Scaffold a plugin.',
                usage: 'plugin [output-path]',
                pkg: '@webpack-cli/generators',
            },
            [],
            async (outputPath) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-plugin-generator';

                env.registerStub(pluginGenerator, generatorName);

                env.run(generatorName, () => {
                    logger.success('Plugin template has been successfully scaffolded.');
                });
            },
        );
    }
}

export default GeneratorsCommand;
export { addonGenerator, initGenerator };

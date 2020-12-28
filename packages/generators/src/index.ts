import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

class GeneratorsCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

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

        cli.makeCommand(
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

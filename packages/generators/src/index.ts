import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

class GeneratorsCommand {
    apply(cli): void {
        const { program, logger } = cli;

        program
            .command('loader [output-path]')
            .alias('l')
            .description('Scaffold a loader')
            .usage('loader [output-path]')
            .action(async (outputPath) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-loader-generator';

                env.registerStub(loaderGenerator, generatorName);

                env.run(generatorName, () => {
                    logger.success('Loader template has been successfully scaffolded.');
                });
            });

        program
            .command('plugin [output-path]')
            .alias('p')
            .description('Scaffold a plugin')
            .usage('plugin [output-path]')
            .action(async (outputPath) => {
                const env = yeoman.createEnv([], { cwd: outputPath });
                const generatorName = 'webpack-plugin-generator';

                env.registerStub(pluginGenerator, generatorName);

                env.run(generatorName, () => {
                    logger.success('Plugin template has been successfully scaffolded.');
                });
            });
    }
}

export default GeneratorsCommand;
export { addonGenerator, initGenerator };

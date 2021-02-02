import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

import { modifyHelperUtil } from './utils/modify-config-helper';
import { npmPackagesExists } from './utils/npm-packages-exists';

class GeneratorsCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'init [scaffold...]',
                alias: 'c',
                description: 'Initialize a new webpack configuration.',
                usage: '[scaffold...] [options]',
                pkg: '@webpack-cli/generators',
            },
            [
                {
                    name: 'auto',
                    type: Boolean,
                    description: 'To generate default config',
                },
                {
                    name: 'generation-path',
                    type: String,
                    description: 'To scaffold in a specified path',
                },
            ],
            async (scaffold, options) => {
                if (scaffold && scaffold.length > 0) {
                    await npmPackagesExists(scaffold);

                    return;
                }

                modifyHelperUtil(initGenerator, null, null, options.auto, options.generationPath);
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

export * from './utils/ast-utils';
export * from './utils/copy-utils';
export * from './utils/modify-config-helper';
export * from './utils/npm-packages-exists';
export * from './utils/recursive-parser';
export * from './utils/resolve-packages';
export * from './utils/run-prettier';
export * from './utils/scaffold';
export * from './utils/validate-identifier';
export * from './utils/prop-types';
export * from './utils/global-packages-path';

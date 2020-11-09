import { pluginGenerator } from '@webpack-cli/generators';
import yeoman from 'yeoman-environment';
import { utils } from 'webpack-cli';

const { logger } = utils;

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */

export default function pluginCreator(...args: string[]): void {
    const generationPath = args[0];
    const env = yeoman.createEnv([], { cwd: generationPath });
    const generatorName = 'webpack-plugin-generator';

    env.registerStub(pluginGenerator, generatorName);

    env.run(generatorName, () => {
        logger.success('Plugin template has been successfully scaffolded.');
    });
}

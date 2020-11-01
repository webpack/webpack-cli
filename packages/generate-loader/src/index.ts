import { loaderGenerator } from '@webpack-cli/generators';
import yeoman from 'yeoman-environment';
import { logger } from 'webpack-cli';

/**
 * Runs a yeoman generator to create a new webpack loader project
 * @returns {void}
 */

export default function loaderCreator(): void {
    const env = yeoman.createEnv();
    const generatorName = 'webpack-loader-generator';

    env.registerStub(loaderGenerator, generatorName);

    env.run(generatorName, () => {
        logger.success('Loader template has been successfully scaffolded.');
    });
}

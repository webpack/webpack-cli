import { pluginGenerator } from '@webpack-cli/generators';
import yeoman from 'yeoman-environment';

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */

export default function pluginCreator(): void {
    const env = yeoman.createEnv();
    const generatorName = 'webpack-plugin-generator';

    env.registerStub(pluginGenerator, generatorName);

    env.run(generatorName);
}

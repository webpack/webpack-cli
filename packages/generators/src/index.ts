import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

import { utils } from 'webpack-cli';

const { logger } = utils;

export { addonGenerator, initGenerator };

export default (args: Array<string>, name: string): void => {
    const generationPath = args[0];
    const env = yeoman.createEnv([], { cwd: generationPath });
    if (name === 'loader') {
        const generatorName = 'webpack-loader-generator';

        env.registerStub(loaderGenerator as any, generatorName);

        env.run(generatorName, () => {
            logger.success('Loader template has been successfully scaffolded.');
        });
    }
    if (name === 'plugin') {
        const generatorName = 'webpack-plugin-generator';

        env.registerStub(pluginGenerator as any, generatorName);

        env.run(generatorName, () => {
            logger.success('Plugin template has been successfully scaffolded.');
        });
    }
};

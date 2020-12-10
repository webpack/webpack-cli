import yeoman from 'yeoman-environment';
import loaderGenerator from './loader-generator';
import pluginGenerator from './plugin-generator';
import addonGenerator from './addon-generator';
import initGenerator from './init-generator';

import { utils } from 'webpack-cli';

const { logger } = utils;

export default (args: Array<string>, name: string): void => {
    const generationPath = args[0];
    const env = yeoman.createEnv([], { cwd: generationPath });
    if (name === 'loader') {
        const generatorName = 'webpack-loader-generator';

        env.registerStub(loaderGenerator, generatorName);

        env.run(generatorName, () => {
            logger.success('Loader template has been successfully scaffolded.');
        });
    }
    if (name === 'plugin') {
        const generatorName = 'webpack-plugin-generator';

        env.registerStub(pluginGenerator, generatorName);

        env.run(generatorName, () => {
            logger.success('Plugin template has been successfully scaffolded.');
        });
    }
};

export { addonGenerator, initGenerator };

export * from './utils/ast-utils';
export * from './utils/copy-utils';
export * from './utils/modify-config-helper';
export * from './utils/npm-exists';
export * from './utils/npm-packages-exists';
export * from './utils/recursive-parser';
export * from './utils/resolve-packages';
export * from './utils/run-prettier';
export * from './utils/scaffold';
export * from './utils/validate-identifier';
export * from './utils/prop-types';
export * from './utils/global-packages-path';

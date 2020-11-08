import path from 'path';
import yeoman from 'yeoman-environment';
import { utils } from 'webpack-cli';
import addonGenerator from './addon-generator';
import { toKebabCase } from './utils/helpers';

const { logger } = utils;

/**
 * Formats a string into webpack loader format
 * (eg: 'style-loader', 'raw-loader')
 *
 * @param {string} name A loader name to be formatted
 * @returns {string} The formatted string
 */
export function makeLoaderName(name: string): string {
    name = toKebabCase(name);
    if (!/loader$/.test(name)) {
        name += '-loader';
    }
    return name;
}

/**
 * A yeoman generator class for creating a webpack
 * loader project. It adds some starter loader code
 * and runs `webpack-defaults`.
 *
 * @class LoaderGenerator
 * @extends {Generator}
 */

export const LoaderGenerator = addonGenerator(
    [
        {
            default: 'my-loader',
            filter: makeLoaderName,
            message: 'Loader name',
            name: 'name',
            type: 'input',
            validate: (str: string): boolean => str.length > 0,
        },
    ],
    path.resolve(__dirname, '../loader-template'),
    [
        'src/cjs.js.tpl',
        'test/test-utils.js.tpl',
        'test/unit.test.js.tpl',
        'test/functional.test.js.tpl',
        'test/fixtures/simple-file.js.tpl',
        'examples/simple/webpack.config.js.tpl',
        'examples/simple/src/index.js.tpl',
        'examples/simple/src/lazy-module.js.tpl',
        'examples/simple/src/static-esm-module.js.tpl',
    ],
    ['src/_index.js.tpl'],
    (gen): object => ({ name: gen.props.name }),
);

/**
 * Runs a yeoman generator to create a new webpack loader project
 * @returns {void}
 */

export default function loaderCreator(): void {
    const env = yeoman.createEnv();
    const generatorName = 'webpack-loader-generator';

    env.registerStub(LoaderGenerator, generatorName);

    env.run(generatorName, () => {
        logger.success('Loader template has been successfully scaffolded.');
    });
}

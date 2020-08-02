import { red, green } from 'colorette';
import fs from 'fs';
import path from 'path';
import yeoman from 'yeoman-environment';
import Generator from 'yeoman-generator';
import { runTransform } from './scaffold';
import { getPackageManager } from '@webpack-cli/package-utils';

export interface Config extends Object {
    item?: {
        name: string;
    };
    topScope?: string[];
    configName?: string;
    merge: string | string[];
    webpackOptions: object;
}

export interface TransformConfig extends Object {
    configPath?: string;
    configFile?: string;
    config?: Config;
}

export interface WebpackScaffoldObject extends Object {
    config: {
        configName?: string;
        topScope?: string[];
        webpackOptions?: object;
    };
    usingDefaults?: boolean;
}

const DEFAULT_WEBPACK_CONFIG_FILENAME = 'webpack.config.js';

/**
 *
 * Looks up the webpack.config in the user's path and runs a given
 * generator scaffold followed up by a transform
 *
 * @param {String} action — action to be done (add, remove, update, init)
 * @param {Class} generator - Yeoman generator class
 * @param {String} configFile - Name of the existing/default webpack configuration file
 * @param {Array} packages - List of packages to resolve
 * @returns {Function} runTransform - Returns a transformation instance
 */

export function modifyHelperUtil(
    action: string,
    generator: typeof Generator,
    configFile: string = DEFAULT_WEBPACK_CONFIG_FILENAME,
    packages?: string[],
    autoSetDefaults = false,
    generateConfig = false,
): void {
    const configPath: string | null = null;

    const env = yeoman.createEnv('webpack', null);
    const generatorName = 'webpack-init-generator';

    if (!generator) {
        generator = class extends Generator {
            public initializing(): void {
                packages.forEach(
                    (pkgPath: string): Generator => {
                        return this.composeWith(require.resolve(pkgPath), {});
                    },
                );
            }
        };
    }

    // this is the default name that the yeoman generator uses when writing
    // to .yo-rc.json
    // see: https://github.com/yeoman/generator/blob/v4.5.0/lib/index.js#L773
    let packageName = '*';
    try {
        const packagePath = path.resolve(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const packageData = require(packagePath);
            if (packageData && packageData.name) {
                packageName = packageData.name;
            }
        }
    } catch (err) {
        console.error(red('\nYour package.json was incorrectly formatted.\n'));
        Error.stackTraceLimit = 0;
        process.exitCode = -1;
    }

    env.registerStub(generator, generatorName);
    env.run(generatorName, {
        configFile,
        autoSetDefaults,
    })
        .then((): void => {
            let configModule: object;
            let finalConfig: WebpackScaffoldObject = {
                config: {},
            };
            try {
                const confPath = path.resolve(process.cwd(), '.yo-rc.json');
                configModule = require(confPath);
            } catch (err) {
                console.error(red('\nCould not find a yeoman configuration file (.yo-rc.json).\n'));
                console.error(
                    red("\nPlease make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.\n"),
                );
                Error.stackTraceLimit = 0;
                process.exitCode = -1;
            }
            try {
                // the configuration stored in .yo-rc.json should already be in the correct
                // WebpackScaffoldObject format
                // it is labeled with the name property from the user's package.json, meaning
                // we should simply access that value, rather than iterating through all
                // the configs that are stored in .yo-rc.json
                if (configModule[packageName] && configModule[packageName].configuration) {
                    finalConfig = configModule[packageName].configuration;
                }
            } catch (err) {
                console.error(err);
                console.error(err.stack);
                console.error(
                    red('\nYour yeoman configuration file (.yo-rc.json) was incorrectly formatted. Deleting it may fix the problem.\n'),
                );
                Error.stackTraceLimit = 0;
                process.exitCode = -1;
            }

            const transformConfig = Object.assign(
                {
                    configFile: !configPath ? null : fs.readFileSync(configPath, 'utf8'),
                    configPath,
                },
                finalConfig,
            ) as TransformConfig;
            if (finalConfig.usingDefaults && finalConfig.usingDefaults === true) {
                const runCommand = getPackageManager() === 'yarn' ? 'yarn build' : 'npm run build';

                const successMessage = `\nYou can now run ${green(runCommand)} to bundle your application!\n\n`;
                process.stdout.write(`\n${successMessage}`);
            }

            // scaffold webpack config file from using .yo-rc.json
            return runTransform(transformConfig, 'init', generateConfig);
        })
        .catch((err): void => {
            console.error(
                red(
                    `
Unexpected Error
please file an issue here https://github.com/webpack/webpack-cli/issues/new?template=Bug_report.md
				`,
                ),
            );
            console.error(err);
        });
}

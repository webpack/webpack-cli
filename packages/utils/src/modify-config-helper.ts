import fs from 'fs';
import path from 'path';
import yeoman from 'yeoman-environment';
import Generator from 'yeoman-generator';
import { runTransform } from './scaffold';
import { utils } from 'webpack-cli';

const { logger } = utils;

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

export function modifyHelperUtil(
    action: string,
    generator: Generator.GeneratorConstructor,
    configFile: string = DEFAULT_WEBPACK_CONFIG_FILENAME,
    packages?: string[],
    autoSetDefaults = false,
    generateConfig = false,
    generationPath = '.',
): void {
    const configPath: string | null = null;

    const env = yeoman.createEnv('webpack', { cwd: generationPath });
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
        const packagePath = path.resolve(generationPath, 'package.json');

        if (fs.existsSync(packagePath)) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const packageData = require(packagePath);
            if (packageData && packageData.name) {
                packageName = packageData.name;
            }
        }
    } catch (err) {
        logger.error('Your package.json was incorrectly formatted.');
        Error.stackTraceLimit = 0;
        process.exitCode = 2;
    }

    env.registerStub(generator, generatorName);
    env.run(
        generatorName,
        {
            configFile,
            autoSetDefaults,
            generationPath,
        },
        () => {
            let configModule: object;
            let finalConfig: WebpackScaffoldObject = {
                config: {},
            };
            try {
                const confPath = path.resolve(generationPath, '.yo-rc.json');
                configModule = require(confPath);
            } catch (err) {
                logger.error('Could not find a yeoman configuration file (.yo-rc.json).');
                logger.error(
                    "Please make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.",
                );
                Error.stackTraceLimit = 0;
                process.exitCode = 2;
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
                logger.error(err);
                logger.error(`${err.stack}\n`);
                logger.error('Your yeoman configuration file (.yo-rc.json) was incorrectly formatted. Deleting it may fix the problem.\n');
                Error.stackTraceLimit = 0;
                process.exitCode = 2;
            }

            try {
                const transformConfig = Object.assign(
                    {
                        configFile: !configPath ? null : fs.readFileSync(configPath, 'utf8'),
                        configPath,
                    },
                    finalConfig,
                ) as TransformConfig;

                // scaffold webpack config file from using .yo-rc.json
                return runTransform(transformConfig, 'init', generateConfig, generationPath);
            } catch (error) {
                logger.error(error);
                process.exitCode = 2;
            }
        },
    );
}

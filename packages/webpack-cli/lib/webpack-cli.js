const path = require('path');
const { program } = require('commander');
const getPkg = require('./utils/package-exists');
const webpack = getPkg('webpack') ? require('webpack') : undefined;
const webpackMerge = require('webpack-merge');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');
const { createWriteStream, existsSync } = require('fs');
const leven = require('leven');
const { options: coloretteOptions, yellow, cyan, green, bold } = require('colorette');
const { stringifyStream: createJsonStringifyStream } = require('@discoveryjs/json-ext');

const logger = require('./utils/logger');
const { cli, flags } = require('./utils/cli-flags');
const CLIPlugin = require('./plugins/CLIPlugin');
const promptInstallation = require('./utils/prompt-installation');

const toKebabCase = require('./utils/to-kebab-case');

const { resolve, extname } = path;

class WebpackCLI {
    constructor() {
        this.logger = logger;
        // Initialize program
        this.program = program;
        this.program.name('webpack');
        this.program.storeOptionsAsProperties(false);
        this.utils = { toKebabCase, getPkg, promptInstallation };
    }

    makeCommand(commandOptions, optionsForCommand = [], action) {
        const command = program.command(commandOptions.name, {
            noHelp: commandOptions.noHelp,
            hidden: commandOptions.hidden,
            isDefault: commandOptions.isDefault,
        });

        if (commandOptions.description) {
            command.description(commandOptions.description);
        }

        if (commandOptions.usage) {
            command.usage(commandOptions.usage);
        }

        if (Array.isArray(commandOptions.alias)) {
            command.aliases(commandOptions.alias);
        } else {
            command.alias(commandOptions.alias);
        }

        if (commandOptions.pkg) {
            command.pkg = commandOptions.pkg;
        } else {
            command.pkg = 'webpack-cli';
        }

        if (optionsForCommand.length > 0) {
            optionsForCommand.forEach((optionForCommand) => {
                this.makeOption(command, optionForCommand);
            });
        }

        command.action(action);

        return command;
    }

    // TODO refactor this terrible stuff
    makeOption(command, option) {
        let optionType = option.type;
        let isStringOrBool = false;

        if (Array.isArray(optionType)) {
            // filter out duplicate types
            optionType = optionType.filter((type, index) => {
                return optionType.indexOf(type) === index;
            });

            // the only multi type currently supported is String and Boolean,
            // if there is a case where a different multi type is needed it
            // must be added here
            if (optionType.length === 0) {
                // if no type is provided in the array fall back to Boolean
                optionType = Boolean;
            } else if (optionType.length === 1 || optionType.length > 2) {
                // treat arrays with 1 or > 2 args as a single type
                optionType = optionType[0];
            } else {
                // only String and Boolean multi type is supported
                if (optionType.includes(Boolean) && optionType.includes(String)) {
                    isStringOrBool = true;
                } else {
                    optionType = optionType[0];
                }
            }
        }

        const flags = option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`;

        let flagsWithType = flags;

        if (isStringOrBool) {
            // commander recognizes [value] as an optional placeholder,
            // making this flag work either as a string or a boolean
            flagsWithType = `${flags} [value]`;
        } else if (optionType !== Boolean) {
            // <value> is a required placeholder for any non-Boolean types
            flagsWithType = `${flags} <value>`;
        }

        if (isStringOrBool || optionType === Boolean || optionType === String) {
            if (option.multiple) {
                // a multiple argument parsing function
                const multiArg = (value, previous = []) => previous.concat([value]);

                command.option(flagsWithType, option.description, multiArg, option.defaultValue);
            } else if (option.multipleType) {
                // for options which accept multiple types like env
                // so you can do `--env platform=staging --env production`
                // { platform: "staging", production: true }
                const multiArg = (value, previous = {}) => {
                    // this ensures we're only splitting by the first `=`
                    const [allKeys, val] = value.split(/=(.+)/, 2);
                    const splitKeys = allKeys.split(/\.(?!$)/);

                    let prevRef = previous;

                    splitKeys.forEach((someKey, index) => {
                        if (!prevRef[someKey]) {
                            prevRef[someKey] = {};
                        }

                        if ('string' === typeof prevRef[someKey]) {
                            prevRef[someKey] = {};
                        }

                        if (index === splitKeys.length - 1) {
                            prevRef[someKey] = val || true;
                        }

                        prevRef = prevRef[someKey];
                    });

                    return previous;
                };

                command.option(flagsWithType, option.description, multiArg, option.defaultValue);
            } else {
                // Prevent default behavior for standalone options
                command.option(flagsWithType, option.description, option.defaultValue);
            }
        } else if (optionType === Number) {
            // this will parse the flag as a number
            command.option(flagsWithType, option.description, Number, option.defaultValue);
        } else {
            // in this case the type is a parsing function
            command.option(flagsWithType, option.description, optionType, option.defaultValue);
        }

        if (option.negative) {
            // commander requires explicitly adding the negated version of boolean flags
            const negatedFlag = `--no-${option.name}`;

            command.option(negatedFlag, option.negatedDescription ? option.negatedDescription : `Negative '${option.name}' option.`);
        }
    }

    getBuiltInOptions() {
        return flags;
    }

    // TODO fully refactor after `--help`
    async run(args) {
        // Built-in external commands
        const externalBuiltInCommandsInfo = [
            {
                name: 'serve',
                alias: 's',
                pkg: '@webpack-cli/serve',
            },
            {
                name: 'info',
                alias: 'i',
                pkg: '@webpack-cli/info',
            },
            {
                name: 'init',
                alias: 'c',
                pkg: '@webpack-cli/init',
            },
            {
                name: 'loader',
                alias: 'l',
                pkg: '@webpack-cli/generators',
            },
            {
                name: 'plugin',
                alias: 'p',
                pkg: '@webpack-cli/generators',
            },
            {
                name: 'migrate',
                alias: 'm',
                pkg: '@webpack-cli/migrate',
            },
        ];
        const bundleCommandOptions = {
            name: 'bundle',
            alias: 'b',
            description: 'The build tool for modern web applications.\nDocumentation: https://webpack.js.org.\nRun webpack.',
            usage: '[options]',
        };

        const getCommandNameAndOptions = (args) => {
            let commandName;
            const options = [];

            let allowToSearchCommand = true;

            args.forEach((arg) => {
                if (!arg.startsWith('-') && allowToSearchCommand) {
                    commandName = arg;

                    allowToSearchCommand = false;

                    return;
                }

                allowToSearchCommand = false;

                options.push(arg);
            });

            return { commandName: commandName || 'bundle', options };
        };
        const loadCommandByName = async (commandName, allowToInstall = false) => {
            if (commandName === 'help' || commandName === 'h') {
                return;
            }

            if (commandName === 'version' || commandName === 'v') {
                return;
            }

            const isDefaultBundleCommand = commandName === bundleCommandOptions.name || commandName === bundleCommandOptions.alias;

            if (isDefaultBundleCommand) {
                // Make `bundle|b [options]` command
                this.makeCommand(bundleCommandOptions, this.getBuiltInOptions(), async (program) => {
                    const options = program.opts();

                    if (typeof colorFromArguments !== 'undefined') {
                        options.color = colorFromArguments;
                    }

                    if (program.args.length > 0) {
                        const possibleCommands = [].concat(['bundle']).concat(program.args);

                        logger.error('Running multiple commands at the same time is not possible');
                        logger.error(`Found commands: ${possibleCommands.map((item) => `'${item}'`).join(', ')}`);
                        logger.error("Run 'webpack --help' to see available commands and options");
                        process.exit(2);
                    }

                    await this.bundleCommand(options);
                });
            } else {
                const builtInExternalCommandInfo = externalBuiltInCommandsInfo.find(
                    (externalBuiltInCommandInfo) =>
                        externalBuiltInCommandInfo.name === commandName || externalBuiltInCommandInfo.alias === commandName,
                );

                let pkg;

                if (builtInExternalCommandInfo) {
                    ({ pkg } = builtInExternalCommandInfo);
                } else {
                    pkg = commandName;
                }

                if (pkg !== 'webpack-cli' && !getPkg(pkg)) {
                    if (!allowToInstall) {
                        logger.error(`Unknown '${commandName}' command`);
                        logger.error("Run 'webpack --help' to see available commands and options");
                        process.exit(2);
                    }

                    try {
                        pkg = await promptInstallation(pkg, () => {
                            logger.error(`For using this command you need to install: '${green(commandName)}' package`);
                        });
                    } catch (error) {
                        logger.error(`Action Interrupted, use ${cyan('webpack-cli help')} to see possible commands`);
                        process.exit(2);
                    }
                }

                let loadedCommand;

                try {
                    loadedCommand = require(pkg);
                } catch (error) {
                    // Ignore, command is not installed

                    return;
                }

                if (loadedCommand.default) {
                    loadedCommand = loadedCommand.default;
                }

                let command;

                try {
                    command = new loadedCommand();

                    await command.apply(this);
                } catch (error) {
                    logger.error(`Unable to load '${pkg}' command`);
                    logger.error(error);
                    process.exit(2);
                }
            }
        };

        // Register own exit
        this.program.exitOverride(async (error) => {
            if (error.exitCode === 0) {
                process.exit(0);
            }

            if (error.code === 'executeSubCommandAsync') {
                process.exit(2);
            }

            if (error.code === 'commander.help') {
                process.exit(0);
            }

            if (error.code === 'commander.unknownOption') {
                let name = error.message.match(/'(.+)'/);

                if (name) {
                    name = name[1].substr(2);

                    if (name.includes('=')) {
                        name = name.split('=')[0];
                    }

                    const { commandName } = getCommandNameAndOptions(this.program.args);

                    if (commandName) {
                        const command = this.program.commands.find(
                            (command) => command.name() === commandName || command.alias() === commandName,
                        );

                        if (!command) {
                            logger.error(`Can't find and load ${commandName} command`);
                            logger.error("Run 'webpack --help' to see available commands and options");
                            process.exit(2);
                        }

                        const found = command.options.find((option) => leven(name, option.long.slice(2)) < 3);

                        if (found) {
                            logger.error(`Did you mean '--${found.name()}'?`);
                        }
                    }
                }
            }

            // Codes:
            // - commander.unknownCommand
            // - commander.missingArgument
            // - commander.missingMandatoryOptionValue
            // - commander.optionMissingArgument

            logger.error("Run 'webpack --help' to see available commands and options");
            process.exit(2);
        });

        // Default `--color` and `--no-color` options
        // TODO doesn't work with `webpack serve` (never work, need fix), `--stats` doesn't work too, other options are fine
        let colorFromArguments;

        this.program.option('--color', 'Enable colors on console');
        this.program.on('option:color', function () {
            const { color } = this.opts();

            colorFromArguments = color;
            coloretteOptions.enabled = color;
        });
        this.program.option('--no-color', 'Enable colors on console');
        this.program.on('option:no-color', function () {
            const { color } = this.opts();

            colorFromArguments = color;
            coloretteOptions.enabled = color;
        });

        // Make `-v, --version` options
        // Make `version|v [commands...]` command
        const outputVersion = async (commandNames) => {
            const possibleCommandNames = commandNames.filter(
                (possibleCommandName) =>
                    possibleCommandName !== bundleCommandOptions.name && possibleCommandName !== bundleCommandOptions.alias,
            );

            possibleCommandNames.forEach((possibleCommandName) => {
                const isOption = possibleCommandName.startsWith('-');

                if (isOption) {
                    logger.error(`Unknown option '${possibleCommandName}'`);
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                } else if (possibleCommandName === 'version') {
                    logger.error("Unknown command 'version'");
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                } else if (possibleCommandName === 'help') {
                    logger.error("Unknown command 'help'");
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                }
            });

            if (possibleCommandNames.length > 0) {
                await Promise.all(
                    possibleCommandNames.map((possibleCommand) => {
                        if (possibleCommand !== bundleCommandOptions.name && possibleCommand !== bundleCommandOptions.alias) {
                            return loadCommandByName(possibleCommand);
                        }

                        return Promise.resolve();
                    }),
                );

                const availableCommands = this.program.commands.map((command) => ({
                    name: command.name(),
                    alias: command.alias(),
                    pkg: command.pkg,
                }));

                for (const possibleCommandName of possibleCommandNames) {
                    const commandInfo = availableCommands.find(
                        (availableCommand) =>
                            availableCommand.name === possibleCommandName || availableCommand.alias === possibleCommandName,
                    );

                    try {
                        const { name, version } = require(`${commandInfo.pkg}/package.json`);

                        logger.raw(`${name} ${version}`);
                    } catch (e) {
                        logger.error(`Error: External package '${commandInfo.pkg}' not found`);
                        process.exit(2);
                    }
                }
            }

            const pkgJSON = require('../package.json');

            logger.raw(`webpack ${webpack.version}`);
            logger.raw(`webpack-cli ${pkgJSON.version}`);

            if (getPkg('webpack-dev-server')) {
                // eslint-disable-next-line node/no-extraneous-require
                const { version } = require('webpack-dev-server/package.json');

                logger.raw(`webpack-dev-server ${version}`);
            }

            process.exit(0);
        };
        this.program.option('-v, --version', "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands");
        // TODO no need, buggy
        this.makeCommand(
            {
                name: 'version [commands...]',
                alias: 'v',
                description: "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands",
                usage: '[commands...]',
            },
            [],
            outputVersion,
        );

        //  Default global `help` command
        const outputHelp = async (options, isVerbose, program) => {
            const isGlobal = options.length === 0;

            if (isGlobal) {
                // TODO bundle options by default
                // TODO available commands
                program.outputHelp();
            } else {
                options.slice(1).forEach((option) => {
                    logger.error(`Unknown option '${option}'`);
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                });

                const name = options[0];

                await loadCommandByName(name);

                const command = this.program.commands.find((command) => command.name() === name || command.alias() === name);

                if (isVerbose) {
                    command.outputHelp();
                } else {
                    command.options = command.options.filter((option) => {
                        const foundOption = flags.find((flag) => {
                            if (option.negate && flag.negative) {
                                return `no-${flag.name}` === option.name();
                            }

                            return flag.name === option.name();
                        });

                        if (foundOption && foundOption.help) {
                            return foundOption.help === 'minimum';
                        }

                        return true;
                    });
                    command.outputHelp();

                    logger.raw("\nTo see list of all supported commands and options run 'webpack --help=verbose'.");
                }
            }

            logger.raw(`\n${bold('Made with ♥ by the webpack team')}.`);
            process.exit(0);
        };
        this.program.helpOption(false);
        this.program.addHelpCommand(false);
        this.program.option('-h, --help [verbose]', 'Display help for commands and options');

        let isInternalActionCalled = false;

        // Default action
        this.program.usage(
            '[options]\nAlternative usage: webpack --config <config> [options]\nAlternative usage: webpack [command] [options]',
        );
        this.program.allowUnknownOption(true);
        this.program.action(async (program) => {
            if (!isInternalActionCalled) {
                isInternalActionCalled = true;
            } else {
                logger.error('No commands found to run');
                process.exit(2);
            }

            const { commandName, options } = getCommandNameAndOptions(program.args);

            const opts = program.opts();

            if (opts.version) {
                outputVersion(program.args);

                return;
            }

            if (opts.help || commandName === 'help' || commandName === 'h') {
                let isVerbose = false;

                if (opts.help) {
                    if (typeof opts.help === 'string') {
                        if (opts.help !== 'verbose') {
                            logger.error("Unknown value for '--help' option, please use '--help=verbose'");
                            process.exit(2);
                        }

                        isVerbose = true;
                    }
                }

                const optionsForHelp = [].concat(opts.help ? [commandName] : []).concat(options);

                await outputHelp(optionsForHelp, isVerbose, program);

                return;
            }

            await loadCommandByName(commandName, true);

            await this.program.parseAsync([commandName, ...options], { from: 'user' });
        });

        await this.program.parseAsync(args);
    }

    async resolveConfig(options) {
        const loadConfig = async (configPath) => {
            const ext = extname(configPath);
            const interpreted = Object.keys(jsVariants).find((variant) => variant === ext);

            if (interpreted) {
                rechoir.prepare(extensions, configPath);
            }

            const { pathToFileURL } = require('url');

            let importESM;

            try {
                importESM = new Function('id', 'return import(id);');
            } catch (e) {
                importESM = null;
            }

            let options;

            try {
                try {
                    options = require(configPath);
                } catch (error) {
                    if (pathToFileURL && importESM && error.code === 'ERR_REQUIRE_ESM') {
                        const urlForConfig = pathToFileURL(configPath);

                        options = await importESM(urlForConfig);
                        options = options.default;

                        return { options, path: configPath };
                    }

                    throw error;
                }
            } catch (error) {
                logger.error(`Failed to load '${configPath}'`);
                logger.error(error);
                process.exit(2);
            }

            if (options.default) {
                options = options.default;
            }

            return { options, path: configPath };
        };

        const evaluateConfig = async (loadedConfig, args) => {
            const isMultiCompiler = Array.isArray(loadedConfig.options);
            const config = isMultiCompiler ? loadedConfig.options : [loadedConfig.options];

            let evaluatedConfig = await Promise.all(
                config.map(async (rawConfig) => {
                    if (typeof rawConfig.then === 'function') {
                        rawConfig = await rawConfig;
                    }

                    // `Promise` may return `Function`
                    if (typeof rawConfig === 'function') {
                        // when config is a function, pass the env from args to the config function
                        rawConfig = await rawConfig(args.env, args);
                    }

                    return rawConfig;
                }),
            );

            loadedConfig.options = isMultiCompiler ? evaluatedConfig : evaluatedConfig[0];

            const isObject = (value) => typeof value === 'object' && value !== null;

            if (!isObject(loadedConfig.options) && !Array.isArray(loadedConfig.options)) {
                logger.error(`Invalid configuration in '${loadedConfig.path}'`);
                process.exit(2);
            }

            return loadedConfig;
        };

        let config = { options: {}, path: new WeakMap() };

        if (options.config && options.config.length > 0) {
            const evaluatedConfigs = await Promise.all(
                options.config.map(async (value) => {
                    const configPath = resolve(value);

                    if (!existsSync(configPath)) {
                        logger.error(`The specified config file doesn't exist in '${configPath}'`);
                        process.exit(2);
                    }

                    const loadedConfig = await loadConfig(configPath);

                    return evaluateConfig(loadedConfig, options);
                }),
            );

            config.options = [];

            evaluatedConfigs.forEach((evaluatedConfig) => {
                if (Array.isArray(evaluatedConfig.options)) {
                    evaluatedConfig.options.forEach((options) => {
                        config.options.push(options);
                        config.path.set(options, evaluatedConfig.path);
                    });
                } else {
                    config.options.push(evaluatedConfig.options);
                    config.path.set(evaluatedConfig.options, evaluatedConfig.path);
                }
            });

            config.options = config.options.length === 1 ? config.options[0] : config.options;
        } else {
            // Order defines the priority, in increasing order
            const defaultConfigFiles = ['webpack.config', '.webpack/webpack.config', '.webpack/webpackfile']
                .map((filename) =>
                    // Since .cjs is not available on interpret side add it manually to default config extension list
                    [...Object.keys(extensions), '.cjs'].map((ext) => ({
                        path: resolve(filename + ext),
                        ext: ext,
                        module: extensions[ext],
                    })),
                )
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

            let foundDefaultConfigFile;

            for (const defaultConfigFile of defaultConfigFiles) {
                if (existsSync(defaultConfigFile.path)) {
                    foundDefaultConfigFile = defaultConfigFile;
                    break;
                }
            }

            if (foundDefaultConfigFile) {
                const loadedConfig = await loadConfig(foundDefaultConfigFile.path);
                const evaluatedConfig = await evaluateConfig(loadedConfig, options);

                config.options = evaluatedConfig.options;

                if (Array.isArray(config.options)) {
                    config.options.forEach((options) => {
                        config.path.set(options, evaluatedConfig.path);
                    });
                } else {
                    config.path.set(evaluatedConfig.options, evaluatedConfig.path);
                }
            }
        }

        if (options.configName) {
            const notfoundConfigNames = [];

            config.options = options.configName.map((configName) => {
                let found;

                if (Array.isArray(config.options)) {
                    found = config.options.find((options) => options.name === configName);
                } else {
                    found = config.options.name === configName ? config.options : undefined;
                }

                if (!found) {
                    notfoundConfigNames.push(configName);
                }

                return found;
            });

            if (notfoundConfigNames.length > 0) {
                logger.error(
                    notfoundConfigNames.map((configName) => `Configuration with the name "${configName}" was not found.`).join(' '),
                );
                process.exit(2);
            }
        }

        if (options.merge) {
            // we can only merge when there are multiple configurations
            // either by passing multiple configs by flags or passing a
            // single config exporting an array
            if (!Array.isArray(config.options) || config.options.length <= 1) {
                logger.error('At least two configurations are required for merge.');
                process.exit(2);
            }

            const mergedConfigPaths = [];

            config.options = config.options.reduce((accumulator, options) => {
                const configPath = config.path.get(options);
                const mergedOptions = webpackMerge(accumulator, options);

                mergedConfigPaths.push(configPath);

                return mergedOptions;
            }, {});
            config.path.set(config.options, mergedConfigPaths);
        }

        return config;
    }

    // TODO refactor
    async applyOptions(config, options) {
        if (options.analyze) {
            if (!getPkg('webpack-bundle-analyzer')) {
                try {
                    await promptInstallation('webpack-bundle-analyzer', () => {
                        logger.error(`It looks like ${yellow('webpack-bundle-analyzer')} is not installed.`);
                    });
                } catch (error) {
                    logger.error(`Action Interrupted, Please try once again or install ${yellow('webpack-bundle-analyzer')} manually.`);
                    process.exit(2);
                }

                logger.success(`${yellow('webpack-bundle-analyzer')} was installed successfully.`);
            }
        }

        if (typeof options.progress === 'string' && options.progress !== 'profile') {
            logger.error(`'${options.progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`);
            process.exit(2);
        }

        if (Object.keys(options).length === 0 && !process.env.NODE_ENV) {
            return config;
        }

        if (cli) {
            const processArguments = (configOptions) => {
                const coreFlagMap = flags
                    .filter((flag) => flag.group === 'core')
                    .reduce((accumulator, flag) => {
                        accumulator[flag.name] = flag;

                        return accumulator;
                    }, {});
                const coreConfig = Object.keys(options).reduce((accumulator, name) => {
                    const kebabName = toKebabCase(name);

                    if (coreFlagMap[kebabName]) {
                        accumulator[kebabName] = options[name];
                    }

                    return accumulator;
                }, {});
                const problems = cli.processArguments(coreFlagMap, configOptions, coreConfig);

                if (problems) {
                    problems.forEach((problem) => {
                        // TODO improve expected
                        logger.error(
                            `Found the '${problem.type}' problem with the '--${problem.argument}' argument${
                                problem.path ? ` by path '${problem.path}'` : ''
                            }, expected '${problem.expected}'`,
                        );
                    });

                    process.exit(2);
                }

                return configOptions;
            };

            config.options = Array.isArray(config.options)
                ? config.options.map((options) => processArguments(options))
                : processArguments(config.options);

            const setupDefaultOptions = (configOptions) => {
                // No need to run for webpack@4
                if (configOptions.cache && configOptions.cache.type === 'filesystem') {
                    const configPath = config.path.get(configOptions);

                    if (configPath) {
                        if (!configOptions.cache.buildDependencies) {
                            configOptions.cache.buildDependencies = {};
                        }

                        if (!configOptions.cache.buildDependencies.defaultConfig) {
                            configOptions.cache.buildDependencies.defaultConfig = [];
                        }

                        if (Array.isArray(configPath)) {
                            configPath.forEach((item) => {
                                configOptions.cache.buildDependencies.defaultConfig.push(item);
                            });
                        } else {
                            configOptions.cache.buildDependencies.defaultConfig.push(configPath);
                        }
                    }
                }

                return configOptions;
            };

            config.options = Array.isArray(config.options)
                ? config.options.map((options) => setupDefaultOptions(options))
                : setupDefaultOptions(config.options);
        }

        // Logic for webpack@4
        // TODO remove after drop webpack@4
        const processLegacyArguments = (configOptions) => {
            if (options.entry) {
                configOptions.entry = options.entry;
            }

            if (options.outputPath) {
                configOptions.output = {
                    ...configOptions.output,
                    ...{ path: path.resolve(options.outputPath) },
                };
            }

            if (options.target) {
                configOptions.target = options.target;
            }

            if (typeof options.devtool !== 'undefined') {
                configOptions.devtool = options.devtool;
            }

            if (options.mode) {
                configOptions.mode = options.mode;
            } else if (
                !configOptions.mode &&
                process.env &&
                process.env.NODE_ENV &&
                (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'node')
            ) {
                configOptions.mode = process.env.NODE_ENV;
            }

            if (options.name) {
                configOptions.name = options.name;
            }

            if (typeof options.stats !== 'undefined') {
                configOptions.stats = options.stats;
            }

            if (typeof options.watch !== 'undefined') {
                configOptions.watch = options.watch;
            }

            return configOptions;
        };

        config.options = Array.isArray(config.options)
            ? config.options.map((options) => processLegacyArguments(options))
            : processLegacyArguments(config.options);

        return config;
    }

    async applyCLIPlugin(config, options) {
        const addCLIPlugin = (configOptions) => {
            if (!configOptions.plugins) {
                configOptions.plugins = [];
            }

            configOptions.plugins.unshift(
                new CLIPlugin({
                    configPath: config.path,
                    helpfulOutput: !options.json,
                    hot: options.hot,
                    progress: options.progress,
                    prefetch: options.prefetch,
                    analyze: options.analyze,
                }),
            );

            return configOptions;
        };

        config.options = Array.isArray(config.options)
            ? config.options.map((options) => addCLIPlugin(options))
            : addCLIPlugin(config.options);

        return config;
    }

    async createCompiler(options, callback) {
        let config = await this.resolveConfig(options);

        config = await this.applyOptions(config, options);
        config = await this.applyCLIPlugin(config, options);

        let compiler;

        try {
            compiler = webpack(config.options, callback);
        } catch (error) {
            // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
            // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
            const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

            // In case of schema errors print and exit process
            // For webpack@4 and webpack@5
            if (error instanceof ValidationError) {
                logger.error(error.message);
            } else {
                logger.error(error);
            }

            process.exit(2);
        }

        return compiler;
    }

    async bundleCommand(options) {
        let compiler;

        const callback = (error, stats) => {
            if (error) {
                logger.error(error);
                process.exit(2);
            }

            if (stats.hasErrors()) {
                process.exitCode = 1;
            }

            const getStatsOptions = (stats) => {
                // TODO remove after drop webpack@4
                if (webpack.Stats && webpack.Stats.presetToOptions) {
                    if (!stats) {
                        stats = {};
                    } else if (typeof stats === 'boolean' || typeof stats === 'string') {
                        stats = webpack.Stats.presetToOptions(stats);
                    }
                }

                let colors;

                // From arguments
                if (typeof options.color !== 'undefined') {
                    colors = options.color;
                }
                // From stats
                else if (typeof stats.colors !== 'undefined') {
                    colors = stats.colors;
                }
                // Default
                else {
                    colors = coloretteOptions.enabled;
                }

                stats.colors = colors;

                return stats;
            };

            const getStatsOptionsFromCompiler = (compiler) => getStatsOptions(compiler.options ? compiler.options.stats : undefined);

            if (!compiler) {
                return;
            }

            const foundStats = compiler.compilers
                ? { children: compiler.compilers.map(getStatsOptionsFromCompiler) }
                : getStatsOptionsFromCompiler(compiler);
            const handleWriteError = (error) => {
                logger.error(error);
                process.exit(2);
            };

            if (options.json === true) {
                createJsonStringifyStream(stats.toJson(foundStats))
                    .on('error', handleWriteError)
                    .pipe(process.stdout)
                    .on('error', handleWriteError)
                    .on('close', () => process.stdout.write('\n'));
            } else if (typeof options.json === 'string') {
                createJsonStringifyStream(stats.toJson(foundStats))
                    .on('error', handleWriteError)
                    .pipe(createWriteStream(options.json))
                    .on('error', handleWriteError)
                    .on('close', () => logger.success(`stats are successfully stored as json to ${options.json}`));
            } else {
                const printedStats = stats.toString(foundStats);

                // Avoid extra empty line when `stats: 'none'`
                if (printedStats) {
                    logger.raw(`${stats.toString(foundStats)}`);
                }
            }
        };

        options.env = { WEBPACK_BUNDLE: true, ...options.env };

        compiler = await this.createCompiler(options, callback);

        // TODO webpack@4 return Watching and MultiWathing instead Compiler and MultiCompiler, remove this after drop webpack@4
        if (compiler && compiler.compiler) {
            compiler = compiler.compiler;
        }
    }
}

module.exports = WebpackCLI;

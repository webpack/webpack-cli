const path = require('path');
const { program } = require('commander');
const getPkg = require('./utils/package-exists');
const webpack = getPkg('webpack') ? require('webpack') : undefined;
const webpackMerge = require('webpack-merge');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');
const { createWriteStream, existsSync } = require('fs');
const { distance } = require('fastest-levenshtein');
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

    async makeCommand(commandOptions, options, action) {
        const command = this.program.command(commandOptions.name, {
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

        const { forHelp } = this.program;

        let allDependenciesInstalled = true;

        if (commandOptions.dependencies && commandOptions.dependencies.length > 0) {
            for (const dependency of commandOptions.dependencies) {
                const isPkgExist = getPkg(dependency);

                if (isPkgExist) {
                    continue;
                } else if (!isPkgExist && forHelp) {
                    allDependenciesInstalled = false;
                    continue;
                }

                try {
                    await promptInstallation(dependency, () => {
                        logger.error(
                            `For using '${green(commandOptions.name)}' command you need to install: '${green(dependency)}' package`,
                        );
                    });
                } catch (error) {
                    logger.error("Action Interrupted, use 'webpack-cli help' to see possible commands.");
                    logger.error(error);
                    process.exit(2);
                }
            }
        }

        if (options) {
            if (typeof options === 'function') {
                if (forHelp && !allDependenciesInstalled) {
                    command.description(
                        `${commandOptions.description} To see all available options you need to install ${commandOptions.dependencies
                            .map((dependency) => `'${dependency}'`)
                            .join(',')}.`,
                    );
                    options = [];
                } else {
                    options = options();
                }
            }

            options.forEach((optionForCommand) => {
                this.makeOption(command, optionForCommand);
            });
        }

        command.action(action);

        return command;
    }

    makeOption(command, option) {
        let type = option.type;
        let isMultipleTypes = Array.isArray(type);
        let isOptional = false;

        if (isMultipleTypes) {
            if (type.length === 1) {
                type = type[0];
                isMultipleTypes = false;
            } else {
                isOptional = type.includes(Boolean);
            }
        }

        const isMultiple = option.multiple;
        const isRequired = type !== Boolean && typeof type !== 'undefined';

        let flags = option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`;

        if (isOptional) {
            // `commander.js` recognizes [value] as an optional placeholder, making this flag work either as a string or a boolean
            flags = `${flags} [value${isMultiple ? '...' : ''}]`;
        } else if (isRequired) {
            // <value> is a required placeholder for any non-Boolean types
            flags = `${flags} <value${isMultiple ? '...' : ''}>`;
        }

        // TODO need to fix on webpack-dev-server side
        // `describe` used by `webpack-dev-server`
        const description = option.description || option.describe || '';
        const defaultValue = option.defaultValue;

        if (type === Boolean) {
            command.option(flags, description, defaultValue);
        } else if (type === Number) {
            let skipDefault = true;

            command.option(
                flags,
                description,
                (value, prev = []) => {
                    if (defaultValue && isMultiple && skipDefault) {
                        prev = [];
                        skipDefault = false;
                    }

                    return isMultiple ? [].concat(prev).concat(Number(value)) : Number(value);
                },
                defaultValue,
            );
        } else if (type === String) {
            let skipDefault = true;

            command.option(
                flags,
                description,
                (value, prev = []) => {
                    if (defaultValue && isMultiple && skipDefault) {
                        prev = [];
                        skipDefault = false;
                    }

                    return isMultiple ? [].concat(prev).concat(value) : value;
                },
                defaultValue,
            );
        } else if (isMultipleTypes) {
            let skipDefault = true;

            command.option(
                flags,
                description,
                (value, prev = []) => {
                    if (defaultValue && isMultiple && skipDefault) {
                        prev = [];
                        skipDefault = false;
                    }

                    if (type.includes(Number)) {
                        const numberValue = Number(value);

                        if (!isNaN(numberValue)) {
                            return isMultiple ? [].concat(prev).concat(numberValue) : numberValue;
                        }
                    }

                    if (type.includes(String)) {
                        return isMultiple ? [].concat(prev).concat(value) : value;
                    }

                    return value;
                },
                defaultValue,
            );
        } else {
            command.option(flags, description, type, defaultValue);
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

    async run(args) {
        // Built-in internal commands
        const bundleCommandOptions = {
            name: 'bundle',
            alias: 'b',
            description: 'Run webpack (default command, can be omitted).',
            usage: '[options]',
        };
        const versionCommandOptions = {
            name: 'version',
            alias: 'v',
            description: "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
            usage: '[commands...]',
        };
        const helpCommandOptions = {
            name: 'help',
            alias: 'h',
            description: 'Display help for commands and options.',
            usage: '[command]',
        };
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

        const knownCommands = [bundleCommandOptions, versionCommandOptions, helpCommandOptions, ...externalBuiltInCommandsInfo];
        const isKnownCommand = (name) => knownCommands.find((command) => command.name === name || command.alias === name);

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

            const isDefault = typeof commandName === 'undefined';

            return { commandName: isDefault ? bundleCommandOptions.name : commandName, options, isDefault };
        };
        const loadCommandByName = async (commandName, allowToInstall = false) => {
            if (commandName === bundleCommandOptions.name || commandName === bundleCommandOptions.alias) {
                // Make `bundle|b [options]` command
                this.makeCommand(bundleCommandOptions, this.getBuiltInOptions(), async (program) => {
                    const options = program.opts();

                    if (typeof colorFromArguments !== 'undefined') {
                        options.color = colorFromArguments;
                    }

                    if (program.args.length > 0) {
                        const possibleCommands = [].concat([bundleCommandOptions.name]).concat(program.args);

                        logger.error('Running multiple commands at the same time is not possible');
                        logger.error(`Found commands: ${possibleCommands.map((item) => `'${item}'`).join(', ')}`);
                        logger.error("Run 'webpack --help' to see available commands and options");
                        process.exit(2);
                    }

                    await this.bundleCommand(options);
                });
            } else if (commandName === helpCommandOptions.name || commandName === helpCommandOptions.alias) {
                // Stub for the `help` command
                this.makeCommand(helpCommandOptions, [], () => {});
            } else if (commandName === versionCommandOptions.name || commandName === helpCommandOptions.alias) {
                // Stub for the `help` command
                this.makeCommand(versionCommandOptions, [], () => {});
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
                        return;
                    }

                    try {
                        pkg = await promptInstallation(pkg, () => {
                            logger.error(`For using this command you need to install: '${green(commandName)}' package`);
                        });
                    } catch (error) {
                        logger.error(`Action Interrupted, use '${cyan('webpack-cli help')}' to see possible commands`);
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
                            logger.error(`Can't find and load command '${commandName}'`);
                            logger.error("Run 'webpack --help' to see available commands and options");
                            process.exit(2);
                        }

                        const found = command.options.find((option) => distance(name, option.long.slice(2)) < 3);

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

        this.program.option('--color', 'Enable colors on console.');
        this.program.on('option:color', function () {
            const { color } = this.opts();

            colorFromArguments = color;
            coloretteOptions.enabled = color;
        });
        this.program.option('--no-color', 'Disable colors on console.');
        this.program.on('option:no-color', function () {
            const { color } = this.opts();

            colorFromArguments = color;
            coloretteOptions.enabled = color;
        });

        // Make `-v, --version` options
        // Make `version|v [commands...]` command
        const outputVersion = async (options) => {
            // Filter `bundle`, `version` and `help` commands
            const possibleCommandNames = options.filter(
                (options) =>
                    options !== bundleCommandOptions.name &&
                    options !== bundleCommandOptions.alias &&
                    options !== versionCommandOptions.name &&
                    options !== versionCommandOptions.alias &&
                    options !== helpCommandOptions.name &&
                    options !== helpCommandOptions.alias,
            );

            possibleCommandNames.forEach((possibleCommandName) => {
                const isOption = possibleCommandName.startsWith('-');

                if (!isOption) {
                    return;
                }

                logger.error(`Unknown option '${possibleCommandName}'`);
                logger.error("Run 'webpack --help' to see available commands and options");
                process.exit(2);
            });

            if (possibleCommandNames.length > 0) {
                await Promise.all(possibleCommandNames.map((possibleCommand) => loadCommandByName(possibleCommand)));

                for (const possibleCommandName of possibleCommandNames) {
                    const foundCommand = this.program.commands.find(
                        (command) => command.name() === possibleCommandName || command.alias() === possibleCommandName,
                    );

                    if (!foundCommand) {
                        logger.error(`Unknown command '${possibleCommandName}'`);
                        logger.error("Run 'webpack --help' to see available commands and options");
                        process.exit(2);
                    }

                    try {
                        const { name, version } = require(`${foundCommand.pkg}/package.json`);

                        logger.raw(`${name} ${version}`);
                    } catch (e) {
                        logger.error(`Error: External package '${foundCommand.pkg}' not found`);
                        process.exit(2);
                    }
                }
            }

            const pkgJSON = require('../package.json');

            logger.raw(`webpack ${webpack.version}`);
            logger.raw(`webpack-cli ${pkgJSON.version}`);

            if (getPkg('webpack-dev-server')) {
                // eslint-disable-next-line
                const { version } = require('webpack-dev-server/package.json');

                logger.raw(`webpack-dev-server ${version}`);
            }

            process.exit(0);
        };
        this.program.option(
            '-v, --version',
            "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
        );

        //  Default global `help` command
        const outputHelp = async (options, isVerbose, program) => {
            const isGlobal = options.length === 0;
            const hideVerboseOptions = (command) => {
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
            };

            if (isGlobal) {
                const commandsToLoad = []
                    .concat(bundleCommandOptions)
                    .concat(helpCommandOptions)
                    .concat(versionCommandOptions)
                    .concat(externalBuiltInCommandsInfo);

                for (const commandToLoad of commandsToLoad) {
                    await loadCommandByName(commandToLoad.name);
                }

                const bundleCommand = this.program.commands.find(
                    (command) => command.name() === bundleCommandOptions.name || command.alias() === bundleCommandOptions.alias,
                );

                if (!isVerbose) {
                    hideVerboseOptions(bundleCommand);
                }

                let helpInformation = bundleCommand
                    .helpInformation()
                    .trimRight()
                    .replace(bundleCommandOptions.description, 'The build tool for modern web applications.')
                    .replace(
                        /Usage:.+/,
                        'Usage: webpack [options]\nAlternative usage: webpack bundle [options]\nAlternative usage: webpack --config <config> [options]\nAlternative usage: webpack bundle --config <config> [options]',
                    );

                logger.raw(helpInformation);
            } else {
                const [name, ...optionsWithoutCommandName] = options;

                if (name.startsWith('-')) {
                    logger.error(`Unknown option '${name}'`);
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                }

                optionsWithoutCommandName.forEach((option) => {
                    logger.error(`Unknown option '${option}'`);
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                });

                await loadCommandByName(name);

                const command = this.program.commands.find((command) => command.name() === name || command.alias() === name);

                if (!command) {
                    logger.error(`Can't find and load command '${name}'`);
                    logger.error("Run 'webpack --help' to see available commands and options");
                    process.exit(2);
                }

                if (!isVerbose) {
                    hideVerboseOptions(command);
                }

                let helpInformation = command.helpInformation().trimRight();

                if (name === bundleCommandOptions.name || name === bundleCommandOptions.alias) {
                    helpInformation = helpInformation
                        .replace(bundleCommandOptions.description, 'The build tool for modern web applications.')
                        .replace(
                            /Usage:.+/,
                            'Usage: webpack [options]\nAlternative usage: webpack bundle [options]\nAlternative usage: webpack --config <config> [options]\nAlternative usage: webpack bundle --config <config> [options]',
                        );
                }

                logger.raw(helpInformation);
            }

            const globalOptions = program.helpInformation().match(/Options:\n(?<globalOptions>.+)\nCommands:\n/s);

            if (globalOptions && globalOptions.groups.globalOptions) {
                logger.raw('\nGlobal options:');
                logger.raw(globalOptions.groups.globalOptions.trimRight());
            }

            if (isGlobal) {
                const globalCommands = program.helpInformation().match(/Commands:\n(?<globalCommands>.+)/s);

                logger.raw('\nCommands:');
                logger.raw(globalCommands.groups.globalCommands.trimRight());
            }

            logger.raw("\nTo see list of all supported commands and options run 'webpack --help=verbose'.\n");
            logger.raw('Webpack documentation: https://webpack.js.org/.');
            logger.raw('CLI documentation: https://webpack.js.org/api/cli/.');
            logger.raw(`${bold('Made with ♥ by the webpack team')}.`);
            process.exit(0);
        };
        this.program.helpOption(false);
        this.program.addHelpCommand(false);
        this.program.option('-h, --help [verbose]', 'Display help for commands and options.');

        let isInternalActionCalled = false;

        // Default action
        this.program.usage('[options]');
        this.program.allowUnknownOption(true);
        this.program.action(async (program) => {
            if (!isInternalActionCalled) {
                isInternalActionCalled = true;
            } else {
                logger.error('No commands found to run');
                process.exit(2);
            }

            const { commandName, options, isDefault } = getCommandNameAndOptions(program.args);

            const opts = program.opts();

            if (opts.help || commandName === helpCommandOptions.name || commandName === helpCommandOptions.alias) {
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

                this.program.forHelp = true;

                const optionsForHelp = [].concat(opts.help && !isDefault ? [commandName] : []).concat(options);

                await outputHelp(optionsForHelp, isVerbose, program);
            }

            if (opts.version || commandName === versionCommandOptions.name || commandName === versionCommandOptions.alias) {
                const optionsForVersion = [].concat(opts.version ? [commandName] : []).concat(options);

                await outputVersion(optionsForVersion, program);
            }

            if (isKnownCommand(commandName)) {
                await loadCommandByName(commandName, true);
            } else {
                logger.error(`Unknown command '${commandName}'`);

                const found = knownCommands.find((commandOptions) => distance(commandName, commandOptions.name) < 3);

                if (found) {
                    logger.error(`Did you mean '${found.name}' (alias '${found.alias}')?`);
                }

                logger.error("Run 'webpack --help' to see available commands and options");
                process.exit(2);
            }

            await this.program.parseAsync([commandName, ...options], { from: 'user' });
        });

        await this.program.parseAsync(args);
    }

    async resolveConfig(options) {
        const loadConfig = async (configPath) => {
            const ext = extname(configPath);
            const interpreted = Object.keys(jsVariants).find((variant) => variant === ext);

            if (interpreted) {
                try {
                    rechoir.prepare(extensions, configPath);
                } catch (error) {
                    if (error.failures) {
                        logger.error(`Unable load '${configPath}'`);
                        logger.error(error.message);

                        error.failures.forEach((failure) => {
                            logger.error(failure.error.message);
                        });
                        logger.error('Please install one of them');
                        process.exit(2);
                    }

                    logger.error(error);
                    process.exit(2);
                }
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
                const CLIoptions = Object.keys(options).reduce((accumulator, name) => {
                    const kebabName = toKebabCase(name);

                    if (coreFlagMap[kebabName]) {
                        accumulator[kebabName] = options[name];
                    }

                    return accumulator;
                }, {});
                const problems = cli.processArguments(coreFlagMap, configOptions, CLIoptions);

                if (problems) {
                    const capitalizeFirstLetter = (string) => {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    const groupBy = (xs, key) => {
                        return xs.reduce((rv, x) => {
                            (rv[x[key]] = rv[x[key]] || []).push(x);

                            return rv;
                        }, {});
                    };
                    const problemsByPath = groupBy(problems, 'path');

                    for (const path in problemsByPath) {
                        const problems = problemsByPath[path];

                        problems.forEach((problem) => {
                            logger.error(
                                `${capitalizeFirstLetter(problem.type.replace(/-/g, ' '))}${
                                    problem.value ? ` '${problem.value}'` : ''
                                } for the '--${problem.argument}' option${problem.index ? ` by index '${problem.index}'` : ''}`,
                            );

                            if (problem.expected) {
                                logger.error(`Expected: '${problem.expected}'`);
                            }
                        });
                    }

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

            if (typeof options.watchOptionsStdin !== 'undefined') {
                configOptions.watchOptions = {
                    ...configOptions.watchOptions,
                    ...{ stdin: options.watchOptionsStdin },
                };
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

    needWatchStdin(compiler) {
        if (compiler.compilers) {
            return compiler.compilers.some((compiler) => compiler.options.watchOptions && compiler.options.watchOptions.stdin);
        }

        return compiler.options.watchOptions && compiler.options.watchOptions.stdin;
    }

    async createCompiler(options, callback) {
        const isValidationError = (error) => {
            // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
            // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
            const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

            return error instanceof ValidationError;
        };

        let config = await this.resolveConfig(options);

        config = await this.applyOptions(config, options);
        config = await this.applyCLIPlugin(config, options);

        let compiler;

        try {
            compiler = webpack(
                config.options,
                callback
                    ? (error, stats) => {
                          if (isValidationError(error)) {
                              logger.error(error.message);
                              process.exit(2);
                          }

                          callback(error, stats);
                      }
                    : callback,
            );
        } catch (error) {
            if (isValidationError(error)) {
                logger.error(error.message);
            } else {
                logger.error(error);
            }

            process.exit(2);
        }

        // TODO webpack@4 return Watching and MultiWatching instead Compiler and MultiCompiler, remove this after drop webpack@4
        if (compiler && compiler.compiler) {
            compiler = compiler.compiler;
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

            // TODO remove after drop webpack@4
            const statsForWebpack4 = webpack.Stats && webpack.Stats.presetToOptions;

            const getStatsOptions = (stats) => {
                if (statsForWebpack4) {
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

            if (!compiler) {
                return;
            }

            const foundStats = compiler.compilers
                ? {
                      children: compiler.compilers.map((compiler) =>
                          getStatsOptions(compiler.options ? compiler.options.stats : undefined),
                      ),
                  }
                : getStatsOptions(compiler.options ? compiler.options.stats : undefined);

            // TODO webpack@4 doesn't support `{ children: [{ colors: true }, { colors: true }] }` for stats
            if (statsForWebpack4 && compiler.compilers) {
                foundStats.colors = foundStats.children.some((child) => child.colors);
            }

            if (options.json) {
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
                } else {
                    createJsonStringifyStream(stats.toJson(foundStats))
                        .on('error', handleWriteError)
                        .pipe(createWriteStream(options.json))
                        .on('error', handleWriteError)
                        // Use stderr to logging
                        .on('close', () =>
                            process.stderr.write(`[webpack-cli] ${green(`stats are successfully stored as json to ${options.json}`)}\n`),
                        );
                }
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

        if (!compiler) {
            return;
        }

        const isWatch = (compiler) =>
            compiler.compilers ? compiler.compilers.some((compiler) => compiler.options.watch) : compiler.options.watch;

        if (isWatch(compiler) && this.needWatchStdin(compiler)) {
            process.stdin.on('end', () => {
                process.exit(0);
            });
            process.stdin.resume();
        }
    }
}

module.exports = WebpackCLI;

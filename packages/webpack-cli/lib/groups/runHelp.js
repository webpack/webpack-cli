const { options, green, bold, underline } = require('colorette');
const commandLineUsage = require('command-line-usage');

const { commands, flags } = require('../utils/cli-flags');
const logger = require('../utils/logger');

const outputHelp = (args) => {
    if (args.includes('--color')) {
        options.enabled = true;
    } else if (args.includes('--no-color')) {
        options.enabled = false;
    }

    const hasUnknownVersionArgs = (args, commands, flags) => {
        return args.filter((arg) => {
            if (arg === 'version' || arg === 'help' || arg === '--help' || arg === '-h' || arg === '--no-color') {
                return false;
            }

            const foundCommand = commands.find((command) => {
                return command.name === arg || command.alias === arg;
            });
            const foundFlag = flags.find((command) => {
                return `--${command.name}` === arg || `-${command.alias}` === arg;
            });

            return !foundCommand && !foundFlag;
        });
    };

    const invalidArgs = hasUnknownVersionArgs(args, commands, flags);

    if (invalidArgs.length > 0) {
        const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
        logger.error(`Invalid ${argType} '${invalidArgs[0]}'.`);
        logger.error('Run webpack --help to see available commands and arguments.');
        process.exit(2);
    }

    const usedCommand = commands.filter((command) => {
        return args.includes(command.name) || args.includes(command.alias);
    });
    const usedFlag = flags.filter((flag) => {
        if (flag.name === 'help' || flag.name === 'color') {
            return false;
        }

        return args.includes(`--${flag.name}`) || args.includes(`-${flag.alias}`);
    });

    const usedCommandOrFlag = [].concat(usedCommand).concat(usedFlag);

    if (usedCommandOrFlag.length > 1) {
        logger.error(
            `You provided multiple commands or arguments - ${usedCommandOrFlag
                .map((usedFlagOrCommand) => {
                    const isCommand = usedFlagOrCommand.packageName;

                    return `${isCommand ? 'command ' : 'argument '}'${isCommand ? usedFlagOrCommand.name : `--${usedFlagOrCommand.name}`}'${
                        usedFlagOrCommand.alias ? ` (alias '${isCommand ? usedFlagOrCommand.alias : `-${usedFlagOrCommand.alias}`}')` : ''
                    }`;
                })
                .join(', ')}. Please use only one command at a time.`,
        );
        process.exit(2);
    }

    // Print full help when no flag or command is supplied with help
    if (usedCommandOrFlag.length === 1) {
        const [item] = usedCommandOrFlag;
        const isCommand = item.packageName;
        const header = (head) => bold(underline(head));
        const flagAlias = item.alias ? (isCommand ? ` ${item.alias} |` : ` -${item.alias},`) : '';
        const usage = green(`webpack${flagAlias} ${item.usage}`);
        const description = item.description;
        const link = item.link;

        logger.raw(`${header('Usage')}: ${usage}`);
        logger.raw(`${header('Description')}: ${description}`);

        if (link) {
            logger.raw(`${header('Documentation')}: ${link}`);
        }

        if (item.flags) {
            const flags = commandLineUsage({
                header: 'Options',
                optionList: item.flags,
            });
            logger.raw(flags);
        }
    } else {
        const negatedFlags = flags
            .filter((flag) => flag.negative)
            .reduce((allFlags, flag) => {
                // Use available description for built-in negated flags
                const description = flag.negatedDescription ? flag.negatedDescription : `Negates ${flag.name}`;
                return [...allFlags, { name: `no-${flag.name}`, description, type: Boolean }];
            }, []);
        const title = bold('⬡                     ') + underline('webpack') + bold('                     ⬡');
        const desc = 'The build tool for modern web applications';
        const websitelink = '         ' + underline('https://webpack.js.org');
        const usage = bold('Usage') + ': ' + '`' + green('webpack [...options] | <command>') + '`';
        const examples = bold('Example') + ': ' + '`' + green('webpack help --flag | <command>') + '`';
        const hh = `          ${title}\n\n${websitelink}\n\n${desc}\n\n${usage}\n${examples}`;
        const output = commandLineUsage([
            { content: hh, raw: true },
            {
                header: 'Available Commands',
                content: commands.map((cmd) => {
                    return { name: `${cmd.name} | ${cmd.alias}`, summary: cmd.description };
                }),
            },
            {
                header: 'Options',
                optionList: flags
                    .map((e) => {
                        if (e.type.length > 1) {
                            e.type = e.type[0];
                        }

                        // Here we replace special characters with chalk's escape
                        // syntax (`\$&`) to avoid chalk trying to re-process our input.
                        // This is needed because chalk supports a form of `{var}`
                        // interpolation.
                        e.description = e.description.replace(/[{}\\]/g, '\\$&');

                        return e;
                    })
                    .concat(negatedFlags),
            },
        ]);

        logger.raw(output);
    }

    logger.raw('                  Made with ♥️  by the webpack team');
};

module.exports = outputHelp;

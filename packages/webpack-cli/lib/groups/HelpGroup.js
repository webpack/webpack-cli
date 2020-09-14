const { yellow, bold, underline } = require('colorette');
const { core, commands } = require('../utils/cli-flags');
const { defaultCommands } = require('../utils/commands');
const logger = require('../utils/logger');
const commandLineUsage = require('command-line-usage');

class HelpGroup {
    outputHelp(isCommand = true, subject, invalidArgs) {
        if (subject && invalidArgs.length === 0) {
            const info = isCommand ? commands : core;
            // Contains object with details about given subject
            const options = info.find((commandOrFlag) => {
                if (isCommand) {
                    return commandOrFlag.name == subject || commandOrFlag.alias == subject;
                }
                return commandOrFlag.name === subject.slice(2) || commandOrFlag.alias === subject.slice(1);
            });

            const header = (head) => bold(underline(head));
            const flagAlias = options.alias ? (isCommand ? ` ${options.alias} |` : ` -${options.alias},`) : '';
            const usage = yellow(`webpack${flagAlias} ${options.usage}`);
            const description = options.description;
            const link = options.link;

            logger.raw(`${header('Usage')}: ${usage}`);
            logger.raw(`${header('Description')}: ${description}`);

            if (link) {
                logger.raw(`${header('Documentation')}: ${link}`);
            }

            if (options.flags) {
                const flags = commandLineUsage({
                    header: 'Options',
                    optionList: options.flags,
                });
                logger.raw(flags);
            }
        } else if (invalidArgs.length > 0) {
            const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
            logger.warn(`You provided an invalid ${argType} '${invalidArgs[0]}'.`);
            logger.raw(this.run().outputOptions.help);
        } else {
            logger.raw(this.run().outputOptions.help);
        }
        logger.raw('\n                  Made with ♥️  by the webpack team');
    }

    outputVersion(externalPkg, commandsUsed, invalidArgs) {
        if (externalPkg && commandsUsed.length === 1 && invalidArgs.length === 0) {
            try {
                if ([externalPkg.alias, externalPkg.name].some((pkg) => commandsUsed.includes(pkg))) {
                    const { name, version } = require(`@webpack-cli/${defaultCommands[externalPkg.name]}/package.json`);
                    logger.raw(`\n${name} ${version}`);
                } else {
                    const { name, version } = require(`${externalPkg.name}/package.json`);
                    logger.raw(`\n${name} ${version}`);
                }
            } catch (e) {
                logger.error('Error: External package not found.');
                process.exit(2);
            }
        }

        if (commandsUsed.length > 1) {
            logger.error('You provided multiple commands. Please use only one command at a time.\n');
            process.exit(2);
        }

        if (invalidArgs.length > 0) {
            const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
            logger.error(`Error: Invalid ${argType} '${invalidArgs[0]}'.`);
            logger.info('Run webpack --help to see available commands and arguments.\n');
            process.exit(2);
        }

        const pkgJSON = require('../../package.json');
        const webpack = require('webpack');
        logger.raw(`\nwebpack-cli ${pkgJSON.version}`);
        logger.raw(`\nwebpack ${webpack.version}\n`);
    }

    run() {
        const o = (s) => yellow(s);
        const options = require('../utils/cli-flags');
        const negatedFlags = options.core
            .filter((flag) => flag.negative)
            .reduce((allFlags, flag) => {
                return [...allFlags, { name: `no-${flag.name}`, description: `Negates ${flag.name}`, type: Boolean }];
            }, []);
        const title = bold('⬡                     ') + underline('webpack') + bold('                     ⬡');
        const desc = 'The build tool for modern web applications';
        const websitelink = '         ' + underline('https://webpack.js.org');

        const usage = bold('Usage') + ': ' + '`' + o('webpack [...options] | <command>') + '`';
        const examples = bold('Example') + ': ' + '`' + o('webpack help --flag | <command>') + '`';

        const hh = `          ${title}\n
		${websitelink}\n
		${desc}\n
		${usage}\n
		${examples}\n
`;
        const sections = commandLineUsage([
            {
                content: hh,
                raw: true,
            },
            {
                header: 'Available Commands',
                content: options.commands.map((cmd) => {
                    return { name: `${cmd.name} | ${cmd.alias}`, summary: cmd.description };
                }),
            },
            {
                header: 'Options',
                optionList: options.core
                    .map((e) => {
                        if (e.type.length > 1) e.type = e.type[0];
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
        return {
            outputOptions: {
                help: sections,
            },
        };
    }
}

module.exports = HelpGroup;

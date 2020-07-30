const { red, yellow, cyan, bold, underline } = require('colorette');
const { core, commands } = require('../utils/cli-flags');
const { defaultCommands } = require('../utils/commands');
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

            process.stdout.write(`${header('Usage')}: ${usage}\n`);
            process.stdout.write(`${header('Description')}: ${description}\n`);

            if (link) {
                process.stdout.write(`${header('Documentation')}: ${link}\n`);
            }

            if (options.flags) {
                const flags = commandLineUsage({
                    header: 'Options',
                    optionList: options.flags,
                });
                process.stdout.write(flags);
            }
        } else if (invalidArgs.length > 0) {
            const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
            console.warn(yellow(`\nYou provided an invalid ${argType} '${invalidArgs[0]}'.`));
            process.stdout.write(this.run().outputOptions.help);
        } else {
            process.stdout.write(this.run().outputOptions.help);
        }
        process.stdout.write('\n                  Made with ♥️  by the webpack team \n');
    }

    outputVersion(externalPkg, commandsUsed, invalidArgs) {
        if (externalPkg && commandsUsed.length === 1 && invalidArgs.length === 0) {
            try {
                if ([externalPkg.alias, externalPkg.name].some((pkg) => commandsUsed.includes(pkg))) {
                    const { name, version } = require(`@webpack-cli/${defaultCommands[externalPkg.name]}/package.json`);
                    process.stdout.write(`\n${name} ${version}`);
                } else {
                    const { name, version } = require(`${externalPkg.name}/package.json`);
                    process.stdout.write(`\n${name} ${version}`);
                }
            } catch (e) {
                console.error(red('\nError: External package not found.'));
                process.exitCode = -1;
            }
        }

        if (commandsUsed.length > 1) {
            console.error(red('\nYou provided multiple commands. Please use only one command at a time.\n'));
            process.exit();
        }

        if (invalidArgs.length > 0) {
            const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
            console.error(red(`\nError: Invalid ${argType} '${invalidArgs[0]}'.`));
            console.info(cyan('Run webpack --help to see available commands and arguments.\n'));
            process.exit(-2);
        }

        const pkgJSON = require('../../package.json');
        const webpack = require('webpack');
        process.stdout.write(`\nwebpack-cli ${pkgJSON.version}`);
        process.stdout.write(`\nwebpack ${webpack.version}\n`);
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

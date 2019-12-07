/* eslint-disable @typescript-eslint/explicit-function-return-type */
const chalk = require('chalk');
const commandLineUsage = require('command-line-usage');

class HelpGroup {
    outputHelp(subject = null, isCommand = true) {
        if (subject !== null) {
            const info = isCommand ? require('../utils/commands').info : require('../utils/core-flags').info;
            const options = isCommand ? info.find(cmd => cmd.name === subject || cmd.alias === subject) : info.find(flg => flg.name === subject.slice(2) || flg.alias === subject.slice(1));

            const { bold, underline } = chalk.white;
            const header = head => bold(underline(head));
            const usage = chalk.keyword('orange')('webpack ' + options.usage);
            const description = options.description;

            process.stdout.write(`${header('Usage')}: ${usage}\n${header('Description')}: ${description}\n`);
            if (options.flags) {
                const flags = commandLineUsage({
                    header: 'Options',
                    optionList: options.flags,
                });
                process.stdout.write(flags);
            }
        } else {
            process.stdout.write(this.run().outputOptions.help);
        }
        process.stdout.write('\n                  Made with ♥️  by the webpack team \n');
    }

    outputVersion() {
        const pkgJSON = require('../../package.json');
        const webpack = require('webpack');
        process.stdout.write(`\nwebpack-cli ${pkgJSON.version}`);
        process.stdout.write(`\nwebpack ${webpack.version}\n`);
    }

    run() {
        const { underline, bold } = chalk.white;
        const o = s => chalk.keyword('orange')(s);
        const options = require('../utils/cli-flags');
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
                content: options.commands.map(e => {
                    return { name: e.name, summary: e.description };
                }),
            },
            {
                header: 'Options',
                optionList: options.core,
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

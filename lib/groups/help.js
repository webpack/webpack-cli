const chalk = require('chalk');

class HelpGroup {
    b() {
        const b = chalk.blue;
    }

    l() {
        const c = chalk.cyan;
    }
    outputHelp() {
        process.stdout.write(this.run().outputOptions.help);
        process.stdout.write('\n                  Made with ♥️  by the webpack team \n');
    }

    outputVersion() {
        const pkgJSON = require('../../package.json');
        const webpack = require('webpack');
        process.stdout.write(`\nwebpack-cli ${pkgJSON.version}`);
        process.stdout.write(`\nwebpack ${webpack.version}\n`);
    }

    outputCommand(command) {
        const commands = require('../utils/cli-flags').commands;
        const options = commands.find(cmd => (cmd.name == command));
        const { bold } = chalk.white;
        const usage = chalk.keyword('orange')('webpack ' + options.usage);
        const description = options.description;
        process.stdout.write(`${bold('Usage')}: ${usage}\n${bold('Description')}: ${description}\n`);
        process.stdout.write('\n                  Made with ♥️  by the webpack team \n');
    }

    run() {
        const { underline, bold } = chalk.white
        const o = s => chalk.keyword('orange')(s);
        const commandLineUsage = require('command-line-usage');
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

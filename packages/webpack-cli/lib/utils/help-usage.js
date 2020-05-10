const { yellow, underline } = require('chalk');

module.exports = (sections) => {
    let helpOutput = [];
    let list = [];
    let commands = [];

    sections.map((e) => {
        let output = {};

        if (e.header) {
            output.headers = yellow.bold.underline(`${e.header}\n`);
        } else {
            output.headers = '';
        }
        if (typeof e.content === 'string') {
            output.contents = e.content;
        }
        if (typeof e.content === 'object') {
            e.content.map((cmd) => {
                commands.push(`${cmd.name}    \t${cmd.summary}`);
            });
            output.contents = commands.join('\n ');
        }
        if (e.optionList) {
            e.optionList.map((opt) => {
                if (opt.alias) {
                    list.push(`-${opt.alias}, --${opt.name} ${underline(opt.type.name)}      \t${opt.description}`);
                } else {
                    list.push(`--${opt.name} ${underline(opt.type.name)}          \t${opt.description}`);
                }
            });
            output.optionList = list.join('\n ');
        }

        helpOutput.push(output);
    });

    const finalOutput = helpOutput.map((e) => {
        if (e.headers && (e.contents || e.optionList)) {
            return `${e.headers}\n ${e.contents ? e.contents : e.optionList}\n`;
        } else if (e.headers || e.contents) {
            return `\n${e.contents ? e.contents : e.headers}\n`;
        }
    });
    return finalOutput.join('\n');
};

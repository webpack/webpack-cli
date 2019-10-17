const arguments = require('./cli-flags');

const names = [];
arguments.commands.forEach( command => {
    names.push(command.name);
    if (command.alias) names.push(command.alias);
})

module.exports.names = names;
module.exports.commands = arguments.commands;

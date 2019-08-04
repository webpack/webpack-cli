const webpackCli = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const helpFlagPresent = (args) => args.find(arg => ['help', '--help'].indexOf(arg) !== -1);

const normalizeFlags = (args, command) => {
    return args.slice(2).filter(arg => arg.indexOf('--') < 0 && arg !== command.name && arg !== command.alias);
}

const isCommandUsed = (commands) => {
    return commands.find(cmd => {
        if (cmd.alias) {
            return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
        }
        return process.argv.includes(cmd.name);
    });
}

async function runCLI(cli, commandIsUsed) {
    let args;
    const helpFlagExists = helpFlagPresent(process.argv);
    if(helpFlagExists) {
        await cli.runHelp();
        return;
    }
    
    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        args = cmdArgs(core, { stopAtFirstUnknown: false });
        try {
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {
            process.cliLogger.error(err);
            process.exit(1);
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();

const webpackCli = require('./webpack-cli');
const webpackInstance = require('./instance');
const {core, commands} = require('./descriptions/args-detailed');
const cmdArgs = require('command-line-args');

process.on('uncaughtException', (error) => {
  process.cliLogger.error(`Uncaught exception: ${error}`);
  if (error && error.stack)
  process.cliLogger.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  process.cliLogger.error(`Promise rejection: ${error}`);
  if (error && error.stack)
    process.cliLogger.error(error.stack);
  process.exit(1);
});

function findCommand(commands) {
  return commands.find(cmd => {
    if(cmd.alias) {
      return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias)
    }
    return process.argv.includes(cmd.name);
  });
}

function resetArgv(command) {
  process.argv.slice(2).filter(p => p.indexOf('--') < 0 && p !== command.name && p !== command.alias);
}


(async () => {

  const cli = new webpackCli();
  const commandIsUsed = findCommand(commands);

  if(!commandIsUsed) {
    const options = cmdArgs(core, { stopAtFirstUnknown: true });
    const result = await cli.run(options, core);
    return webpackInstance(result, options);
  }

  commandIsUsed.defaultOption = true;
  const options = resetArgv(commandIsUsed);
  const argWithoutCommand = cmdArgs(core, { stopAtFirstUnknown: true });
  return await cli.runCommand(commandIsUsed, argWithoutCommand, ...options);
})();
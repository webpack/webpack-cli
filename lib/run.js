const webpackCli = require('./webpack-cli');
const webpack = require('webpack');
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

(async () => {
  // this needs a better abstraction level
  const commandIsUsed = commands.find(cmd => {
    if(cmd.alias) {
      return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias)
    }
    return process.argv.includes(cmd.name);
  });
  let args;
  const cli = new webpackCli();
  let result;
  if(commandIsUsed) {
    commandIsUsed.defaultOption = true;
    args = process.argv.slice(2).filter(p => p.indexOf('--') < 0 && p !== commandIsUsed.name && p !== commandIsUsed.alias);
    const newArgs = cmdArgs(core, { stopAtFirstUnknown: true });
    result = await cli.runCommand(commandIsUsed, ...args, newArgs);
  } else {
    args = cmdArgs(core, { stopAtFirstUnknown: true });
    try {
      result = await cli.run(args, core);
    } catch (err) {
      process.cliLogger.error(err);
      process.exit(1);
    }
  }
  
  if(result.processingErrors.length > 0) {
    throw new Error(result.processingErrors);
  }
  
  process.exit(0)
  const compiler = webpack(result.webpackOptions);
  compiler.run(() => {});
  
})();
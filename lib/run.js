const webpackCli = require('./webpack-cli');
const webpack = require('webpack');
const yargsConfig = require('./descriptions/args-detailed');
const cmdArgs = require('command-line-args');

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error}`);
  if (error && error.stack)
    console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error(`Promise rejection: ${error}`);
  if (error && error.stack)
    console.error(error.stack);
  process.exit(1);
});

(async () => {
  const args = cmdArgs(yargsConfig);
  const cli = new webpackCli();
  try {
    const result = await cli.run(args, yargsConfig);
    if(result.processingErrors.length > 0) {
      throw new Error(result.processingErrors);
    }
    console.log(result.webpackOptions);
    process.exit(0)
    const compiler = webpack(result.webpackOptions);
    compiler.run(() => {});
  
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
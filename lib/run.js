const webpackCli = require('./webpack-cli');
const yargsConfig = require('./descriptions/args-detailed');
const {detailed} = require('yargs-parser');

(async () => {
  const args = detailed(process.argv.slice(2), yargsConfig);
  const cli = new webpackCli();
  try {
    const result = await cli.run(args, yargsConfig);
    if(result.processingErrors.length > 0) {
      throw new Error(result.processingErrors);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
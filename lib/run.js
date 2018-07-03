const webpackCli = require('./webpack-cli');
const yargsConfig = require('./descriptions/args-detailed');
const {detailed} = require('yargs-parser');

(async () => {
  const args = detailed(process.argv.slice(2), yargsConfig);
  const cli = new webpackCli(args);
  try {
    const result = await cli.run();
  } catch (err) {
    process.exit(1);
  }
})();
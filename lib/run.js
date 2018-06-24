const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');
const webpackCli = require('./webpack-cli');

updateNotifier({pkg: packageJson}).notify();

(async () => {
  const args = process.argv.slice(2);
  const cli = new webpackCli(args);
  try {
    const result = await cli.run();
  } catch (err) {
    process.exit(1);
  }
})();
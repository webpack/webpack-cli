const npmPackagesExists = require('../lib/utils/npm-packages-exists');
const creator = require('../lib/creator/index').creator;

module.exports.command = 'init [addons..]';
module.exports.describe = 'Initializes a new webpack configuration using optional addons';
module.exports.handler = argv => argv.addons.length ? npmPackagesExists(argv.addons) : creator();

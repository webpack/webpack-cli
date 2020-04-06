const Compiler = require('webpack/lib/Compiler');

module.exports = new Compiler().getInfrastructureLogger('webpack-cli');

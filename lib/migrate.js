const migrate = require('webpack-addons').migrate;

module.exports = function transformFile(currentConfigPath, outputConfigPath, options) {
	return migrate(currentConfigPath, outputConfigPath, options);
};

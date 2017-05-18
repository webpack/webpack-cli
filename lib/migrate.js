const migrate = require('webpack-addons').migrateTransform;

module.exports = function transformFile(currentConfigPath, outputConfigPath, options) {
	return migrate(currentConfigPath, outputConfigPath, options);
};

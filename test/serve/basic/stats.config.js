const { isDevServer4 } = require('../../utils/test-utils');

module.exports = {
    mode: 'development',
    devtool: false,
    devServer: isDevServer4
        ? {
              dev: {
                  stats: 'minimal',
              },
          }
        : {
              stats: 'minimal',
          },
};
